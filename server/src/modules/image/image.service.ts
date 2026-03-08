import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@/database/drizzle.service';
import { SwaggerApiService } from '@/swagger/swagger.api';
import { imageTable } from '@/database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ImageService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly swaggerApi: SwaggerApiService,
  ) {}

  private get db() {
    return this.drizzleService.db;
  }

  async getImages(mediaId: number) {
    return this.db
      .select()
      .from(imageTable)
      .where(eq(imageTable.idMedia, mediaId))
      .orderBy(imageTable.idImage);
  }

  async fetchAndSaveImages(mediaId: number, type = 'STILL', limit = 6) {
    try {
      const imagesData = await this.swaggerApi.mediaImages(mediaId, {
        type,
        page: 1,
      });

      if (!imagesData?.items) return;

      const firstImages = imagesData.items.slice(0, limit);
      for (const img of firstImages) {
        await this.db
          .insert(imageTable)
          .values({
            idMedia: mediaId,
            imageUrl: img.imageUrl,
            isAnalyzed: false,
          })
          .onDuplicateKeyUpdate({ set: { imageUrl: img.imageUrl } }); // игнорируем дубликаты
      }

      // Запускаем анализ изображений (асинхронно)
      this.processMediaImages(mediaId).catch(console.error);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  async processMediaImages(mediaId: number) {
    // Здесь должна быть логика анализа изображений (из imageAnalysisController)
    // Пока заглушка
    console.log(`Анализ изображений для медиа ${mediaId} запущен (заглушка)`);
    // В будущем можно вызвать внешний сервис
  }
}