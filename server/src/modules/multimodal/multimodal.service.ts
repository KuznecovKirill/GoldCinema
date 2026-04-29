import { DrizzleService } from "@/database/drizzle.service";
import { imageTable, keywordTable, Media, mediaTable } from "@/database/schema";
import { HttpServer, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { eq } from "drizzle-orm";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MultimodalService {
  private readonly apiUrl: string;
  private readonly log = new Logger(MultimodalService.name); //для логов
  constructor(
    private readonly httpService: HttpServer,
    private readonly configService: ConfigService,
    private readonly drizzleService: DrizzleService,
  ) {
    this.apiUrl = this.configService.get("OLLAMA_URL");
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
      console.log(error);
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

//Анализ изображения, когда оно  добавляется в БД
async analyzeMediaImages(mediaId: number): Promise<void> {
    const images = await this.db.select().from(imageTable).where(eq(imageTable.idMedia, mediaId));
    if (images.length === 0) return;

    // Для каждого изображения составляем краткое описание (можно суммировать)
    for (const img of images) {
      try {
        // Изображение нужно загрузить
        const imageBuffer = await this.loadImage(img.imageUrl);
        const description = await this.askImage(imageBuffer, 'Опиши, что изображено на картинке. Пиши описание кратко, без предлогов, междометий. Только существительные, прилагательные и глаголы.');

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
