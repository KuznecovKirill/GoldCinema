// src/modules/media/media.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
  ApiPropertyOptional,
} from "@nestjs/swagger";
import { MediaService } from "./media.service";
import { CheckToken } from "@/middlewares/middleware";
import z from "zod";
import { createZodDto } from "nestjs-zod";

const GetMediasQuerySchema = z.object({
  mediaType: z.enum(['FILM', 'TV_SERIES']).optional(),
  mediaCategory: z.enum(['popular', 'top']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(10),
});

export class GetMediasQueryDto extends createZodDto(GetMediasQuerySchema) {}

const SearchQuerySchema = z.object({
  query: z.string().min(1),
  mediaType: z.enum(['FILM', 'TV_SERIES', 'ALL']).default('ALL'),
});

export class SearchQueryDto extends createZodDto(SearchQuerySchema) {}

@ApiTags("MEDIA")
@Controller("api/media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiOperation({ summary: "Получить список медиа с пагинацией и фильтрацией" })
  async getMedias(@Query(new ValidationPipe({ transform: true })) query: GetMediasQueryDto) {
    return this.mediaService.getMedias(
      query.mediaType,
      query.mediaCategory,
      query.page,
      query.limit,
    );
  }

  @Get("allMedias")
  @ApiOperation({ summary: "Получить все медиа без пагинации" })
  async getAllMedias() {
    return this.mediaService.getAllMedias();
  }

  @Get("genres")
  @ApiOperation({ summary: "Получить все жанры (опционально по типу медиа)" })
  @ApiQuery({ name: "mediaType", required: false, enum: ["FILM", "TV_SERIES"] })
  async getGenres(@Query("mediaType") mediaType?: string) {
    return this.mediaService.getGenres(mediaType);
  }

  @Get("search/:mediaType")
  @ApiOperation({ summary: "Поиск медиа по ключевым словам" })
  async search(@Param("mediaType", ParseIntPipe) mediaType: string, @Query(new ValidationPipe({ transform: true })) query: SearchQueryDto) {
    return this.mediaService.search(query.query, mediaType);
  }

  @Get("info/:id_media")
  @ApiOperation({ summary: "Получить детальную информацию о медиа" })
  @ApiParam({ name: "id_media", type: Number })
  async getMediaInfo(@Param("id_media", ParseIntPipe) id_media: number, @Req() req) {
    let userId: number | undefined;
    try {
      // Проверяем токен, если есть – получаем userId
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        const decoded = this.decodeToken(token); // нужно реализовать метод декодирования
        if (decoded?.id_user) userId = decoded.id_user;
      }
    } catch {}
    return this.mediaService.getMediaById(id_media, userId);
  }

  @Post("addMedia")
  @ApiBearerAuth()
  @UseGuards(CheckToken)
  @ApiOperation({ summary: "Добавить медиа из Kinopoisk по ID" })
  async addMedia(@Body(ValidationPipe) id_media: number) {
    return this.mediaService.addMediaFromKinopoisk(id_media);
  }

  @Post("popularMovies")
  @ApiBearerAuth()
  @UseGuards(CheckToken)
  @ApiOperation({ summary: "Обновить список популярных фильмов из API" })
  async updatePopularMovies() {
    return this.mediaService.setPopularMovies();
  }

  @Post("popularSeries")
  @ApiBearerAuth()
  @UseGuards(CheckToken)
  @ApiOperation({ summary: "Обновить список популярных сериалов из API" })
  async updatePopularSeries() {
    return this.mediaService.setPopularSeries();
  }

  @Post("topMovies")
  @ApiBearerAuth()
  @UseGuards(CheckToken)
  @ApiOperation({ summary: "Обновить топ-250 фильмов из API" })
  @ApiQuery({ name: "page", required: false, type: Number })
  async updateTopMovies(@Query("page", new ParseIntPipe({ optional: true })) page: number = 1) {
    return this.mediaService.setTopMovies(page);
  }

  @Post("topSeries")
  @ApiBearerAuth()
  @UseGuards(CheckToken)
  @ApiOperation({ summary: "Обновить топ-250 сериалов из API" })
  @ApiQuery({ name: "page", required: false, type: Number })
  async updateTopSeries(@Query("page", new ParseIntPipe({ optional: true })) page: number = 1) {
    return this.mediaService.setTopSeries(page);
  }

  private decodeToken(token: string): any {
    try {
      const jwt = require('jsonwebtoken');
      return jwt.verify(token, process.env.TOKEN_SECRET || '12345');
    } catch {
      return null;
    }
  }
}