import { DrizzleService } from "@/database/drizzle.service";
import { SwaggerApiService } from "@/swagger/swagger.api";
import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "../users/user.service";
import { Genre, genreTable, Image, imageTable, Keyword, keywordTable, Media, mediaGenreTable, mediaTable, popularMovieTable, popularSeriesTable, Review, reviewTable, similarTable, userTable } from "@/database/schema";
import { count, desc, eq, inArray } from "drizzle-orm";
import { Country, countryTable } from "@/database/schema/country.schema";
import { mediaCountryTable } from "@/database/schema/media-country.schema";
import { ImageService } from "../image/image.service";
import { KeywordService } from "../keyword/keyword.service";
import { SimilarService } from "../similar/similar.service";
import { ReviewService } from "../review/review.service";
import { FavoriteService } from "../favorite/favorite.service";

export interface MediaKinopoisk {
     kinopoiskId: number;
      nameRu: string;
      nameOriginal: string;
      type: string;
      countries: {country: string}[];
      year: string;
      filmLength: number;
      ratingAgeLimits: string;
      ratingImdb: number;
      description: string;
      coverUrl: string;
      posterUrl: string;
      genres: {genre: string}[];
}

export interface MediaWithDetails extends Media {
  genres?: Genre[];
  countries?: Country[];
  images?: Image[];
  reviews?: any[];
  keywords?: string | null;
  isFavorite?: boolean;
  similar?: Media[];
}

export interface PaginatedMediasResponse {
  total: number;
  page: number;
  limit: number;
  medias: MediaWithDetails[];
  mediaType?: string;
}
@Injectable()
export class MediaService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly swaggerApi: SwaggerApiService,
    private readonly keywordService: KeywordService,
    private readonly imageService: ImageService,
    @Inject(forwardRef(() => SimilarService))
    private readonly similarService: SimilarService,
    private readonly favoriteService: FavoriteService,
  ) {}

  private get db() {
    return this.drizzleService.db;
  }

   // ---------- Вспомогательные методы для получения связанных данных ----------
  private async getMediaGenres(idMedia: number): Promise<{ idGenre: number; nameGenre: string }[]> {
    return await this.db
      .select({
        idGenre: genreTable.idGenre,
        nameGenre: genreTable.nameGenre,
      })
      .from(mediaGenreTable)
      .innerJoin(genreTable, eq(mediaGenreTable.idGenre, genreTable.idGenre))
      .where(eq(mediaGenreTable.idMedia, idMedia));
  }

  private async getMediaCountries(idMedia: number): Promise<{ idCountry: number; nameCountry: string }[]> {
    return await this.db
      .select({
        idCountry: countryTable.idCountry,
        nameCountry: countryTable.nameCountry,
      })
      .from(mediaCountryTable)
      .innerJoin(countryTable, eq(mediaCountryTable.idCountry, countryTable.idCountry))
      .where(eq(mediaCountryTable.idMedia, idMedia));
  }

  private async getMediaImages(idMedia: number) {
    return await this.db
      .select()
      .from(imageTable)
      .where(eq(imageTable.idMedia, idMedia))
      .orderBy(imageTable.idImage);
  }

  private async getMediaKeywords(idMedia: number) {
    const [kw] = await this.db
      .select()
      .from(keywordTable)
      .where(eq(keywordTable.idMedia, idMedia))
      .limit(1);
    return kw || null;
  }

  private async getMediaReviews(idMedia: number) {
    return await this.db
      .select({
        idReview: reviewTable.idReview,
        ratingUser: reviewTable.ratingUser,
        commentText: reviewTable.commentText,
        createdAt: reviewTable.createdAt,
        user: {
          idUser: userTable.idUser,
          username: userTable.username,
        },
      })
      .from(reviewTable)
      .innerJoin(userTable, eq(reviewTable.idUser, userTable.idUser))
      .where(eq(reviewTable.idMedia, idMedia))
      .orderBy(desc(reviewTable.createdAt));
  }

  private async getMediaSimilar(idMedia: number) {
    const rows = await this.db
      .select({ similarMedia: mediaTable })
      .from(similarTable)
      .innerJoin(mediaTable, eq(similarTable.idMedia, mediaTable.idMedia))
      .where(eq(similarTable.idOrigin, idMedia));
    return rows.map(r => r.similarMedia);
  }

    // Создание медиа из данных Kinopoisk
  async createMediaFromKinopoisk(kinopoiskData: any) {
    const {
      kinopoiskId,
      nameRu,
      nameOriginal,
      type,
      countries,
      year,
      filmLength,
      ratingAgeLimits,
      ratingImdb,
      description,
      coverUrl,
      posterUrl,
      genres,
    } = kinopoiskData;

    const mediaData = {
      idMedia: kinopoiskId,
      title: nameRu || nameOriginal || "Без названия",
      mediaType: type === "TV_SERIES" ? "TV_SERIES" : "FILM",
      year: year?.toString(),
      runningTime: filmLength,
      rars: ratingAgeLimits ? ratingAgeLimits.replace(/\D/g, "") + "+" : null,
      rating: ratingImdb?.toString(),
      description: description || null,
      cover: coverUrl || posterUrl,
    };

    try {
      await this.db.insert(mediaTable).values(mediaData);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException("Медиа уже существует");
      }
      throw error;
    }

    // Добавляем жанры
    if (genres && genres.length > 0) {
      for (const { genre: genreName } of genres) {
        // Ищем или создаем жанр
        let [genre] = await this.db
          .select()
          .from(genreTable)
          .where(eq(genreTable.nameGenre, genreName))
          .limit(1);
        if (!genre) {
          const [newGenre] = await this.db
            .insert(genreTable)
            .values({ nameGenre: genreName })
            .$returningId();
          genre = { idGenre: newGenre.idGenre, nameGenre: genreName };
        }
        await this.db.insert(mediaGenreTable).values({
          idMedia: kinopoiskId,
          idGenre: genre.idGenre,
        }).onDuplicateKeyUpdate({ set: { idMedia: kinopoiskId } });
      }
    }

    // Добавляем страны
    if (countries && countries.length > 0) {
      for (const { country: countryName } of countries) {
        let [country] = await this.db
          .select()
          .from(countryTable)
          .where(eq(countryTable.nameCountry, countryName))
          .limit(1);
        if (!country) {
          const [newCountry] = await this.db
            .insert(countryTable)
            .values({ nameCountry: countryName })
            .$returningId();
          country = { idCountry: newCountry.idCountry, nameCountry: countryName };
        }
        await this.db.insert(mediaCountryTable).values({
          idMedia: kinopoiskId,
          idCountry: country.idCountry,
        }).onDuplicateKeyUpdate({ set: { idMedia: kinopoiskId } });
      }
    }

    // Запускаем фоновые задачи
    this.keywordService.addInfo(kinopoiskId).catch(console.error);
    this.imageService.fetchAndSaveImages(kinopoiskId).catch(console.error);

    return this.getMediaById(kinopoiskId);
  }

    // Получение медиа по ID с деталями
  async getMediaById(idMedia: number, userId?: number): Promise<MediaWithDetails> {
    const [media] = await this.db
      .select()
      .from(mediaTable)
      .where(eq(mediaTable.idMedia, idMedia))
      .limit(1);
    if (!media) throw new NotFoundException("Медиа не найдено");

    const [genres, countries, images, keywords, reviews, similar] = await Promise.all([
      this.getMediaGenres(idMedia),
      this.getMediaCountries(idMedia),
      this.getMediaImages(idMedia),
      this.getMediaKeywords(idMedia),
      this.getMediaReviews(idMedia),
      this.getMediaSimilar(idMedia),
    ]);

    // Проверка и запуск фоновой загрузки недостающих данных
    if (images.length === 0) {
      this.imageService.fetchAndSaveImages(idMedia).catch(console.error);
    }
    if (similar.length === 0) {
      this.similarService.setSimilar(idMedia).catch(console.error);
    }
    if (!keywords) {
      this.keywordService.addInfo(idMedia).catch(console.error);
    }

    let isFavorite = false;
    if (userId) {
      isFavorite = await this.favoriteService.checkIfFavorite(userId, idMedia);
    }

    return {
      ...media,
      genres,
      countries,
      images,
      reviews,
      keywords: keywords?.keywords || null,
      similar,
      isFavorite,
    };
  }

  // Получение списка медиа с пагинацией и категориями
 async getMedias(
    mediaType?: string,
    mediaCategory?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedMediasResponse> {
    try {
       const offset = (page - 1) * limit;

    let baseQuery = this.db.select().from(mediaTable).$dynamic();
    let countQuery = this.db.select({ count: count() }).from(mediaTable).$dynamic();

    if (mediaType) {
      baseQuery = baseQuery.where(eq(mediaTable.mediaType, mediaType)) as any;
      countQuery = countQuery.where(eq(mediaTable.mediaType, mediaType)) as any;
    }

    let orderBy = desc(mediaTable.idMedia);

    if (mediaCategory === 'top') {
      orderBy = desc(mediaTable.rating);
    } else if (mediaCategory === 'popular') {
      const popularModel = mediaType === 'FILM' ? popularMovieTable : popularSeriesTable;
      const popularIds = await this.db
        .select({ idMedia: popularModel.idMedia })
        .from(popularModel);
      const idList = popularIds.map(p => p.idMedia);
      if (idList.length === 0) {
        return { total: 0, page, limit, medias: [] };
      }
      baseQuery = baseQuery.where(inArray(mediaTable.idMedia, idList)) as any;
      countQuery = countQuery.where(inArray(mediaTable.idMedia, idList)) as any;
    }

    const [totalResult] = await countQuery;
    const total = totalResult?.count || 0;

    const medias = await baseQuery
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Для каждого медиа получаем жанры и страны
    const mediaWithDetails = await Promise.all(
      medias.map(async (m) => {
        const genres = await this.getMediaGenres(m.idMedia);
        const countries = await this.getMediaCountries(m.idMedia);
        return {
          ...m,
          genres,
          countries,
          
          images: [],
          reviews: [],
          keywords: null,
          similar: [],
          isFavorite: false,
        } as MediaWithDetails;
      }),
    );
    
    return {
      total,
      page,
      limit,
      medias: mediaWithDetails,
      mediaType,
    };
    } catch (error) {
      console.error('Detailed error in getAllMedias:', error);
    throw error;
    }
   
  }

  // Получить все медиа (без пагинации)
  async getAllMedias(): Promise<MediaWithDetails[]> {
    try {
      const medias = await this.db.select().from(mediaTable);
    return await Promise.all(
      medias.map(async (m) => {
        const genres = await this.getMediaGenres(m.idMedia);
        const countries = await this.getMediaCountries(m.idMedia);
        return {
          ...m,
          genres,
          countries,
          images: [],
          reviews: [],
          keywords: null,
          similar: [],
          isFavorite: false,
        };
      }),
    );
    } catch (error) {
      console.error('Detailed error in getAllMedias:', error);
    throw error;
    }
    
  }
   // Добавить медиа по ID из Kinopoisk
  async addMediaFromKinopoisk(idMedia: number): Promise<MediaWithDetails> {
    const exists = await this.checkMediaExists(idMedia);
    if (exists) throw new ConflictException("Медиа уже существует");
    const kinopoiskData = await this.swaggerApi.mediaByID(idMedia);
    return this.createMediaFromKinopoisk(kinopoiskData);
  }

   async checkMediaExists(idMedia: number): Promise<boolean> {
    const [media] = await this.db
      .select({ idMedia: mediaTable.idMedia })
      .from(mediaTable)
      .where(eq(mediaTable.idMedia, idMedia))
      .limit(1);
    return !!media;
  }

    // Получить все жанры для заданного типа медиа
 async getGenres(mediaType?: string): Promise<string[]> {
    let query = this.db
      .selectDistinct({ nameGenre: genreTable.nameGenre })
      .from(genreTable)
      .innerJoin(mediaGenreTable, eq(genreTable.idGenre, mediaGenreTable.idGenre))
      .innerJoin(mediaTable, eq(mediaGenreTable.idMedia, mediaTable.idMedia));
    if (mediaType) {
      query = query.where(eq(mediaTable.mediaType, mediaType)) as any;
    }
    const rows = await query;
    return rows.map(r => r.nameGenre);
  }

  // Поиск по ключевым словам
   async search(query: string, mediaType: string = 'ALL'): Promise<any[]> {
    let mediaIds: number[] | undefined;
    if (mediaType !== 'ALL') {
      const medias = await this.db
        .select({ idMedia: mediaTable.idMedia })
        .from(mediaTable)
        .where(eq(mediaTable.mediaType, mediaType));
      mediaIds = medias.map(m => m.idMedia);
    }
    const scores = await this.keywordService.search(query, mediaIds);
    const ids = scores.map(s => s.id_media);
    if (ids.length === 0) return [];
    const medias = await this.db
      .select()
      .from(mediaTable)
      .where(inArray(mediaTable.idMedia, ids));
    const scoreMap = Object.fromEntries(scores.map(s => [s.id_media, s.score]));
    return medias
      .map(m => ({ ...m, score: scoreMap[m.idMedia] || 0 }))
      .sort((a, b) => b.score - a.score);
  }

  // Обновление популярных медиа из API
async setPopularMedia(
    collectionType: string,
    popularModel: typeof popularMovieTable | typeof popularSeriesTable,
    mediaTypeLabel: string,
    limit: number = 10,
  ) {
    const data = await this.swaggerApi.mediaCollections({
      type: collectionType,
      page: 1,
    });
    if (!data?.items) throw new BadRequestException("Не удалось получить данные из API");

    const addedIds: number[] = [];
    for (const item of data.items.slice(0, limit)) {
      if (!item.nameRu) continue;
      try {
        let media = await this.db
          .select()
          .from(mediaTable)
          .where(eq(mediaTable.idMedia, item.kinopoiskId))
          .limit(1);
        if (media.length === 0) {
          const newMedia = await this.createMediaFromKinopoisk(item);
          addedIds.push(newMedia.idMedia);
        } else {
          addedIds.push(media[0].idMedia);
        }
      } catch (error) {
        console.error(`Ошибка при обработке медиа ${item.kinopoiskId}:`, error);
      }
    }

    await this.db.delete(popularModel);
    for (const id of addedIds.slice(0, limit)) {
      await this.db.insert(popularModel).values({ idMedia: id });
    }

    return { message: `Обновлено ${addedIds.length} ${mediaTypeLabel}ов`, ids: addedIds.slice(0, limit) };
  }

   // Установка популярных фильмов
 async setPopularMovies() {
    return this.setPopularMedia('TOP_POPULAR_MOVIES', popularMovieTable, 'фильм');
  }

  async setPopularSeries() {
    return this.setPopularMedia('POPULAR_SERIES', popularSeriesTable, 'сериал');
  }

  // Установка топ-250 (без сохранения в отдельную таблицу, просто создаем медиа)
 async setTopMedia(collectionType: string, mediaType: string, page: number = 1) {
    const data = await this.swaggerApi.mediaCollections({ type: collectionType, page });
    if (!data?.items) throw new BadRequestException("Не удалось получить данные из API");

    const addedIds: number[] = [];
    for (const item of data.items.slice(0, 10)) {
      try {
        const exists = await this.checkMediaExists(item.kinopoiskId);
        if (!exists) {
          await this.createMediaFromKinopoisk(item);
          addedIds.push(item.kinopoiskId);
        }
      } catch (error) {
        console.error(`Ошибка при создании медиа ${item.kinopoiskId}:`, error);
      }
    }
    return { added: addedIds, errors: [] };
  }

async setTopMovies(page: number = 1) {
    return this.setTopMedia('TOP_250_MOVIES', 'FILM', page);
  }

  async setTopSeries(page: number = 1) {
    return this.setTopMedia('TOP_250_TV_SHOWS', 'TV_SERIES', page);
  }

}
