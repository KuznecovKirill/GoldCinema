import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from '@/database/drizzle.service';
import { keywordTable, mediaTable, genreTable, mediaGenreTable, reviewTable } from '@/database/schema';
import { eq, inArray, and } from 'drizzle-orm';
import * as natural from 'natural';
import { spawn } from 'node:child_process';
import * as path from 'node:path';
import fetch from 'node-fetch'; // или global fetch

const { TfIdf } = natural;
const tokenizer = new natural.WordTokenizer();

const STOP_WORDS = new Set(['в', 'на', 'к', 'по', 'с', 'из', 'у', 'за', 'от', 'до', 'и', 'а', 'но', 'или', 'как', 'что', 'чтобы', 'если', 'бы', 'же', 'ли', 'что-то', '...', 'для', 'про']);

const REPLACEMENTS: Record<string, string> = {
  FILM: 'фильм',
  TV_SERIES: 'сериал',
  '18+': 'для взрослых 18',
  '16+': 'для подростков 16',
  '12+': 'для детей старше 12 лет',
  '6+': 'для детей старше 6 лет',
  '0+': 'для всех возрастов',
};

@Injectable()
export class KeywordService {
  private readonly logger = new Logger(KeywordService.name);
  private readonly globalVocabulary: Set<string> = new Set();

  constructor(private readonly drizzleService: DrizzleService) {}

  private get db() {
    return this.drizzleService.db;
  }

  // ========== Основные методы ==========

  async addInfo(mediaId: number) {
    try {
      // 1. Получаем медиа
      const [media] = await this.db
        .select()
        .from(mediaTable)
        .where(eq(mediaTable.idMedia, mediaId))
        .limit(1);
      if (!media) throw new Error('Медиа не найдено');

      // 2. Получаем жанры
      const genresRows = await this.db
        .select({ nameGenre: genreTable.nameGenre })
        .from(mediaGenreTable)
        .innerJoin(genreTable, eq(mediaGenreTable.idGenre, genreTable.idGenre))
        .where(eq(mediaGenreTable.idMedia, mediaId));
      const genresString = genresRows.map(g => g.nameGenre).join(' ');

      // 3. Получаем отзывы
      const reviews = await this.db
        .select({ commentText: reviewTable.commentText })
        .from(reviewTable)
        .where(eq(reviewTable.idMedia, mediaId))
        .orderBy(reviewTable.idReview);
      const reviewsText = reviews.map(r => r.commentText).join(' ');

      // 4. Формируем исходный текст
      let combine = `${media.title} ${genresString} ${media.mediaType} ${media.year || ''} ${media.descrition || ''} ${media.rars || ''} ${reviewsText}`;
      combine = this.replaceWords(combine);

      // 5. Лемматизация и фильтрация
      const lemmas = await this.processText(combine);
      let processed = lemmas.join(' ');

      // 6. Убираем дубликаты "фильм" и "сериал"
      processed = this.deduplicateFilmSerial(processed);

      // 7. Сохраняем или обновляем
      const existing = await this.db
        .select()
        .from(keywordTable)
        .where(eq(keywordTable.idMedia, mediaId))
        .limit(1);

      if (existing.length > 0) {
        await this.db
          .update(keywordTable)
          .set({ keywords: processed })
          .where(eq(keywordTable.idMedia, mediaId));
        this.logger.log(`Ключевые слова обновлены для медиа ${mediaId}`);
      } else {
        await this.db
          .insert(keywordTable)
          .values({ idMedia: mediaId, keywords: processed });
        this.logger.log(`Ключевые слова созданы для медиа ${mediaId}`);
      }
    } catch (error) {
      this.logger.error(`Ошибка в addInfo для медиа ${mediaId}:`, error);
    }
  }

  async search(userQuery: string, mediaIds?: number[]) {
    // 1. Получаем все записи ключевых слов (по фильтру mediaIds)
    let query = this.db.select().from(keywordTable);
    if (mediaIds && mediaIds.length > 0) {
      query = query.where(inArray(keywordTable.idMedia, mediaIds)) as any;
    }
    const keywords = await query;

    // 2. Преобразуем в тексты для TF-IDF
    const documents = keywords.map(k => k.keywords || '');

    // 3. Обрабатываем запрос
    const processedQuery = await this.processText(userQuery);
    const queryText = processedQuery.join(' ');

    // 4. Вычисляем TF-IDF
    const { tfidf, queryVector } = this.calculateTfIdf(documents, queryText);

    // 5. Вычисляем схожесть для каждого документа
    const results = keywords
      .map((keyword, index) => {
        const docVector: Record<string, number> = {};
        tfidf.listTerms(index).forEach(item => {
          docVector[item.term] = item.tfidf; // можно ещё item.tf
        });
        const normDoc = this.normalizeVector(docVector);
        const score = this.cosineSimilarity(queryVector, normDoc);
        return { id_media: keyword.idMedia, score };
      })
      .filter(item => item.score > 0.03);

    results.sort((a, b) => b.score - a.score);

    // Асинхронно вызываем RAG (не блокируем ответ)
    // this.ragSearchByKeywords(userQuery, results.slice(0, 20)).catch(err =>
    //   this.logger.error('Ошибка RAG:', err),
    // );

    return results;
  }

  async getKeywords(mediaId: number) {
    const [kw] = await this.db
      .select()
      .from(keywordTable)
      .where(eq(keywordTable.idMedia, mediaId))
      .limit(1);
    return kw || null;
  }

  // ========== Вспомогательные методы ==========

  private replaceWords(text: string): string {
    let result = text;
    for (const [key, value] of Object.entries(REPLACEMENTS)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      result = result.replace(regex, value);
    }
    return result;
  }

  private deduplicateFilmSerial(text: string): string {
    const words = text.split(' ');
    const uniqueWords: string[] = [];
    const filmCount = words.filter(w => w === 'фильм').length;
    const serialCount = words.filter(w => w === 'сериал').length;
    if (filmCount > 0) uniqueWords.push('фильм');
    if (serialCount > 0) uniqueWords.push('сериал');
    words.forEach(w => {
      if (w !== 'фильм' && w !== 'сериал' && !uniqueWords.includes(w)) {
        uniqueWords.push(w);
      }
    });
    return uniqueWords.join(' ');
  }

  async processText(text: string): Promise<string[]> {
    // Токенизация
    let tokens = tokenizer.tokenize(text.toLowerCase()) || [];
    // Удаление стоп-слов
    tokens = tokens.filter(t => !STOP_WORDS.has(t) && t.length > 2);
    // Лемматизация через Python
    try {
      const lemmas = await this.lemmatizeText(tokens.join(' '));
      return lemmas.filter(l => l.length > 2 && !STOP_WORDS.has(l));
    } catch (error) {
      this.logger.error('Ошибка лемматизации, возвращаем исходные токены', error);
      return tokens;
    }
  }

  private lemmatizeText(text: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const python = spawn('python', [
        path.join(__dirname, '..', '..', '..', 'python', 'lemmatize.py'),
        text,
      ]);
      let data = '';
      let error = '';
      python.stdout.on('data', chunk => (data += chunk));
      python.stderr.on('data', chunk => (error += chunk));
      python.on('close', code => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${error}`));
        } else {
          try {
            const lemmas = JSON.parse(data);
            resolve(lemmas);
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  }

  private calculateTfIdf(documents: string[], query: string) {
    const tfidf = new TfIdf();
    documents.forEach(doc => tfidf.addDocument(doc));
    tfidf.addDocument(query);

    const queryIndex = documents.length;
    const queryVector: Record<string, number> = {};
    tfidf.listTerms(queryIndex).forEach(item => {
      queryVector[item.term] = item.tfidf;
    });
    const normQuery = this.normalizeVector(queryVector);
    return { tfidf, queryVector: normQuery };
  }

  private normalizeVector(vec: Record<string, number>): Record<string, number> {
    const magnitude = Math.sqrt(Object.values(vec).reduce((sum, v) => sum + v * v, 0));
    if (magnitude === 0) return vec;
    const normalized: Record<string, number> = {};
    for (const [k, v] of Object.entries(vec)) {
      normalized[k] = v / magnitude;
    }
    return normalized;
  }

  private cosineSimilarity(vecA: Record<string, number>, vecB: Record<string, number>): number {
    let dot = 0;
    for (const key in vecA) {
      if (vecB[key]) dot += vecA[key] * vecB[key];
    }
    const magA = Math.sqrt(Object.values(vecA).reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(Object.values(vecB).reduce((s, v) => s + v * v, 0));
    if (magA === 0 || magB === 0) return 0;
    return dot / (magA * magB);
  }

  private async ragSearchByKeywords(userQuery: string, topResults: Array<{ id_media: number; score: number }>) {
    try {
      const mediaList = await this.db
        .select({ idMedia: mediaTable.idMedia, title: mediaTable.title })
        .from(mediaTable)
        .where(inArray(mediaTable.idMedia, topResults.map(r => r.id_media)));

      const keywordMap = await this.db
        .select({ idMedia: keywordTable.idMedia, keywords: keywordTable.keywords })
        .from(keywordTable)
        .where(inArray(keywordTable.idMedia, topResults.map(r => r.id_media)));

      const combined = topResults.map(r => {
        const media = mediaList.find(m => m.idMedia === r.id_media);
        const kw = keywordMap.find(k => k.idMedia === r.id_media);
        return {
          id_media: r.id_media,
          title: media?.title || '',
          keywords: kw?.keywords || '',
        };
      });

      const prompt = `
Ты - ассистент по поиску фильмов. Вот список фильмов из базы данных, для каждого указан id_media и набор ключевых слов.

Твоя задача: на основе пользовательского запроса выбрать из этого списка наиболее подходящий фильм (или фильмы).
Очень важно:
- Не придумывай фильмы, которых нет в списке.
- Не изменяй ключевые слова, используй их ровно так, как они даны в списке!
- Отвечай на русском языке.
- В ответе укажи id_media и название медиа-контента.

Пользовательский запрос: "${userQuery}"

Список фильмов:
${combined.map((item, idx) => `${idx + 1}. id_media: ${item.id_media}\nНазвание: ${item.title}\nКлючевые слова: ${item.keywords}`).join('\n\n')}

Ответь: какие фильмы наиболее соответствуют запросу?
`;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'qwen2:7b', prompt, stream: false }),
      });
      const data: any = await response.json();
      this.logger.log(`RAG ответ: ${data.response}`);
    } catch (error) {
      this.logger.error('RAG error:', error);
    }
  }
}