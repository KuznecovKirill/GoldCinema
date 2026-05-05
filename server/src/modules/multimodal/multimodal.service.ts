import { DrizzleService } from "@/database/drizzle.service";
import { imageTable, keywordTable, Media, mediaTable } from "@/database/schema";
import { HttpServer, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { eq, inArray } from "drizzle-orm";
import * as fs from 'fs';
import * as path from 'path';
import { KeywordService } from "../keyword/keyword.service";

@Injectable()
export class MultimodalService {
  private readonly apiUrl: string;
  private readonly log = new Logger(MultimodalService.name); //для логов
  constructor(
    private readonly httpService: HttpServer,
    private readonly configService: ConfigService,
    private readonly drizzleService: DrizzleService,
    private readonly keywordService: KeywordService,
  ) {
    this.apiUrl = this.configService.get("OLLAMA_URL") || 'http://localhost:11434';
  }

  private get db() {
    return this.drizzleService.db;
  }


  async askImage(image: string, prompt: string): Promise<string> {
    try {
      const base64Data = image.includes("base64,")
        ? image.split(",")[1]
        : image;

      const payload = {
        model: "qwen2:7b", //Qwen2 - мультимодальный
        prompt: prompt,
        images: [base64Data],
        stream: false,
      };
      const response = await axios.post<{ response: string }>(
        `${this.apiUrl}/api/generate`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      return response.data.response;
    } catch (error) {
      this.log.error(`Ошибка askImage: ${error.message}`);
      return "";
    }
  }

  //Поиск медиа
  async searchMedia(query: string, mediaType?: string): Promise<any[]> {

    let medias = await this.db.select().from(mediaTable); //Берётся список медиа из БД

    //Фильтрация медиа
    if (mediaType && mediaType !== 'ALL') {
      medias = medias.filter(m => m.mediaType === mediaType);
    }
    //Для теста возьму 20, чтобы не нагружать сейчас сильно систему
    const limited: Media[] = medias.slice(0, 20);

    const items = [];
    for (const media of limited) {
      const kw = await this.db.select().from(keywordTable).where(eq(keywordTable.idMedia, media.idMedia)).limit(1);
      items.push({
        id_media: media.idMedia,
        title: media.title,
        description: media.description,
        keywords: kw[0]?.keywords || '',
      });
    }

    const prompt = `
Ты – ассистент по поиску фильмов. У нас есть список медиа с их ID, названием, описанием и ключевыми словами.
Пользовательский запрос: "${query}"
Список медиа (каждый начинается с ID):
${items.map(i => `ID: ${i.id_media}, Название: ${i.title}, Описание: ${i.description}, Ключевые слова: ${i.keywords}`).join('\n')}

Верни ТОЛЬКО JSON-массив объектов, каждый объект содержит "id_media" и "score" (число от 0 до 1). Например: [{"id_media": 123, "score": 0.9}, ...]. Без частиц, предлогов и други малоинформативных слов.`
    ;

    try {
    const response = await axios.post<{ response: string }>(
      `${this.apiUrl}/api/generate`,
      { model: 'qwen2:7b', prompt, stream: false, format: 'json' },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return JSON.parse(response.data.response);
    } catch(error) {
        this.log.error(`Ошибка мультимодального поиска: ${error.message}`)
        return [];
    }
}
//Функция используется для поиска в результате из векторизации
  async searchMedia1(userQuery: string, topResults: Array<{ id_media: number; score: number }>) {
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
Ты – ассистент по поиску фильмов. У нас есть список медиа с их ID, названием, описанием и ключевыми словами.
Пользовательский запрос: "${userQuery}"
Список медиа (каждый начинается с ID):
${combined.map(i => `ID: ${i.id_media}, Название: ${i.title}, Ключевые слова: ${i.keywords}`).join('\n')}

Верни ТОЛЬКО JSON-массив объектов, каждый объект содержит "id_media" и "score" (число от 0 до 1). Например: [{"id_media": 123, "score": 0.9}, ...]. Без частиц, предлогов и други малоинформативных слов.`
    ;
// const prompt = `
// Ты - ассистент по поиску фильмов. Вот список фильмов из базы данных, для каждого указан id_media и набор ключевых слов.

// Твоя задача: на основе пользовательского запроса выбрать из этого списка наиболее подходящий фильм (или фильмы).
// Очень важно:
// - Не придумывай фильмы, которых нет в списке.
// - Не изменяй ключевые слова, используй их ровно так, как они даны в списке!
// - Отвечай на русском языке.
// - В ответе укажи id_media и название медиа-контента.

// Пользовательский запрос: "${userQuery}"

// Список фильмов:
// ${combined.map((item, idx) => `${idx + 1}. id_media: ${item.id_media}\nНазвание: ${item.title}\nКлючевые слова: ${item.keywords}`).join('\n\n')}

// Ответь: какие фильмы наиболее соответствуют запросу?
// `;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'qwen2:7b', prompt, stream: false }),
      });
      const data: any = await response.json();
      this.log.log(`RAG ответ: ${data.response}`);
    } catch (error) {
      this.log.error('RAG error:', error);
    }
  }

//Анализ изображения, когда оно  добавляется в БД
async analyzeMediaImages(mediaId: number): Promise<void> {
    const images = await this.db.select().from(imageTable).where(eq(imageTable.idMedia, mediaId)).limit(10);
    if (images.length === 0) return;

    for (const img of images) {
      try {
        // Изображение нужно загрузить
        const imageBuffer = await this.loadImage(img.imageUrl);
        const description = await this.askImage(imageBuffer, 'Опиши, что изображено на картинке. Пиши описание кратко, без предлогов, междометий. Только существительные, прилагательные и глаголы.');
        if (description) {
          await this.keywordService.addRawKeywords(mediaId, description);
          this.log.log(`Добавлено описание для изображения ${img.idImage}`);
        }
        await this.db.update(imageTable).set({ isAnalyzed: true }).where(eq(imageTable.idImage, img.idImage));
        
      } catch (error) {
        this.log.warn(`Не удалось проанализировать изображение ${img.idImage}`);
      }
    }
  }
  //Загрузка изображения (по url модель не поймет)
  private async loadImage(url: string): Promise<string> {
    
    // Заглушка для локального файла
    if (url.startsWith('/') || url.startsWith('D:') || url.startsWith('./')) {
      const absolute = path.resolve(process.cwd(), url);
      const buffer = fs.readFileSync(absolute);
      return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }
    //Для url
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/jpeg;base64,${base64}`;
    }

}
