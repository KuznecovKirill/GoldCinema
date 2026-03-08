import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from '@/database/drizzle.service';

import { MediaService } from '@/modules/media/media.service'; // предположим, есть
import { similarTable, mediaTable } from '@/database/schema';
import { eq, inArray } from 'drizzle-orm';
import { SwaggerApiService } from '@/swagger/swagger.api';

@Injectable()
export class SimilarService {
  private readonly logger = new Logger(SimilarService.name);

  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly swaggerApi: SwaggerApiService,
    private readonly mediaService: MediaService,
  ) {}

  private get db() {
    return this.drizzleService.db;
  }

  async getSimilar(originId: number) {
    const rows = await this.db
      .select({ similarMedia: mediaTable })
      .from(similarTable)
      .innerJoin(mediaTable, eq(similarTable.idMedia, mediaTable.idMedia))
      .where(eq(similarTable.idOrigin, originId));

    return rows.map(r => r.similarMedia);
  }

  async setSimilar(originId: number, limit = 5) {
    const similarsData = await this.swaggerApi.mediaSimilars(originId);
    if (!similarsData?.items) return;

    const items = similarsData.items.slice(0, limit);
    for (const item of items) {
      const filmId = item.filmId;
      try {
        // Проверяем, есть ли медиа в БД
        const exists = await this.mediaService.checkMediaExists(filmId);
        if (!exists) {
          // Добавляем медиа (через сервис, не через HTTP)
          await this.mediaService.addMediaFromKinopoisk(filmId);
        }
        // Добавляем связь
        await this.db
          .insert(similarTable)
          .values({
            idOrigin: originId,
            idMedia: filmId,
          })
          .onDuplicateKeyUpdate({ set: { idOrigin: originId } }); // игнорируем дубликаты
      } catch (error) {
        this.logger.error(`Ошибка при обработке похожего медиа ${filmId}:`, error);
      }
    }
  }

  async setSimilarAndReturn(originId: number, limit = 5) {
    await this.setSimilar(originId, limit);
    return this.getSimilar(originId);
  }
}