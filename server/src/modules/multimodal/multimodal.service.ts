import { DrizzleService } from "@/database/drizzle.service";
import { keywordTable, Media, mediaTable } from "@/database/schema";
import { HttpServer, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { eq } from "drizzle-orm";

@Injectable()
export class MultimodalService {
  private readonly apiUrl: string;

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

  //Компьютерное зрение
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

    // TODO: дописать промпт
    const prompt = `...`;
    const response = await axios.post<{ response: string }>(
      `${this.apiUrl}/api/generate`,
      { model: 'qwen2:7b', prompt, stream: false, format: 'json' },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return JSON.parse(response.data.response);

}

}
