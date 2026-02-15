// src/modules/favorite/favorite.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { DrizzleService } from "@/database/drizzle.service";

import { eq, and, desc } from "drizzle-orm";

import { favoriteTable } from "@/database/schema/favorite.schema";
import { mediaTable } from "@/database/schema/media.schema";

export interface FavoriteItem {
  id_favorite: number;
  id_user: number;
  id_media: number;
  media?: any;
}
export interface FavoriteResponse {
  success: boolean;
  msg: string;
  favorites?: FavoriteItem[];
  favorite?: FavoriteItem;
}

@Injectable()
export class FavoriteService {
  constructor(private readonly drizzleService: DrizzleService) {}

  private get db() {
    return this.drizzleService.db;
  }

  async getFavoritesOfUser(idUser: number): Promise<FavoriteResponse> {
    try {
      const favorites = await this.db
        .select({
          id_favorite: favoriteTable.idFavorite,
          id_user: favoriteTable.idUser,
          id_media: favoriteTable.idMedia,
          media: {
            id_media: mediaTable.idMedia,
            title: mediaTable.title,
            media_type: mediaTable.mediaType,
            year: mediaTable.year,
            running_time: mediaTable.runningTime,
            rars: mediaTable.rars,
            rating: mediaTable.rating,
            description: mediaTable.descrition,
            cover: mediaTable.cover,
          },
        })
        .from(favoriteTable)
        .leftJoin(mediaTable, eq(favoriteTable.idMedia, mediaTable.idMedia))
        .where(eq(favoriteTable.idUser, idUser))
        .orderBy(desc(favoriteTable.idFavorite));

      return {
        success: true,
        msg: "Список избранного получен",
        favorites,
      };
    } catch (error) {
      console.error("Get favorites error:", error);
      throw new InternalServerErrorException(
        "Ошибка при получении списка избранного",
      );
    }
  }

  async addFavorite(
    id_user: number,
    id_media: number,
  ): Promise<FavoriteResponse> {
    try {
      // Проверяем существует ли медиа
      const mediaExists = await this.db
        .select({ idMedia: mediaTable.idMedia })
        .from(mediaTable)
        .where(eq(mediaTable.idMedia, id_media))
        .limit(1);

      if (!mediaExists.length) {
        throw new NotFoundException("Медиа не найдено");
      }

      // Проверяем, не добавлено ли уже в избранное
      const existingFavorite = await this.db
        .select({ idFavorite: favoriteTable.idFavorite })
        .from(favoriteTable)
        .where(
          and(
            eq(favoriteTable.idUser, id_user),
            eq(favoriteTable.idMedia, id_media),
          ),
        )
        .limit(1);

      if (existingFavorite.length > 0) {
        throw new ConflictException("Этот медиа уже добавлен в избранное");
      }

      // Добавляем в избранное
      const [newFavorite] = await this.db
        .insert(favoriteTable)
        .values({
          idUser: id_user,
          idMedia: id_media,
        })
        .$returningId();

      // Получаем полную информацию о добавленном избранном
      const favoriteWithMedia = await this.db
        .select({
          id_favorite: favoriteTable.idFavorite,
          id_user: favoriteTable.idUser,
          id_media: favoriteTable.idMedia,
          media: {
            id_media: mediaTable.idMedia,
            title: mediaTable.title,
            media_type: mediaTable.mediaType,
            year: mediaTable.year,
            running_time: mediaTable.runningTime,
            rars: mediaTable.rars,
            rating: mediaTable.rating,
            description: mediaTable.descrition,
            cover: mediaTable.cover,
          },
        })
        .from(favoriteTable)
        .leftJoin(mediaTable, eq(favoriteTable.idMedia, mediaTable.idMedia))
        .where(eq(favoriteTable.idFavorite, newFavorite.idFavorite))
        .limit(1);

      return {
        success: true,
        msg: "Медиа добавлено в избранное",
        favorite: favoriteWithMedia[0],
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      console.error("Add favorite error:", error);
      throw new InternalServerErrorException(
        "Ошибка при добавлении в избранное",
      );
    }
  }

  async removeFavorite(
    id_favorite: number,
    id_user: number,
  ): Promise<FavoriteResponse> {
    try {
      // Проверяем существует ли запись избранного и принадлежит ли пользователю
      const favorite = await this.db
        .select({ idFavorite: favoriteTable.idFavorite })
        .from(favoriteTable)
        .where(
          and(
            eq(favoriteTable.idFavorite, id_favorite),
            eq(favoriteTable.idUser, id_user),
          ),
        )
        .limit(1);

      if (!favorite.length) {
        throw new NotFoundException(
          "Запись избранного не найдена или не принадлежит пользователю",
        );
      }

      // Удаляем запись
      await this.db
        .delete(favoriteTable)
        .where(eq(favoriteTable.idFavorite, id_favorite));

      return {
        success: true,
        msg: "Запись удалена из избранного",
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error("Remove favorite error:", error);
      throw new InternalServerErrorException(
        "Ошибка при удалении из избранного",
      );
    }
  }

  async checkIfFavorite(id_user: number, id_media: number): Promise<boolean> {
    try {
      const result = await this.db
        .select({ idFavorite: favoriteTable.idFavorite })
        .from(favoriteTable)
        .where(
          and(
            eq(favoriteTable.idUser, id_user),
            eq(favoriteTable.idMedia, id_media),
          ),
        )
        .limit(1);

      return result.length > 0;
    } catch (error) {
      console.error("Check favorite error:", error);
      return false;
    }
  }
}
