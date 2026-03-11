// src/modules/favorite/favorite.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { FavoriteService } from "./favorite.service";
import { CheckToken } from "@/middlewares/middleware";
import { UserDecorator } from "@/decorators/user.decorator";
import { User } from "../users/user.service";

@ApiTags("FAVORITES")
@Controller("api/user/favorites")
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(CheckToken)
  @ApiOperation({ summary: "Получить избранное пользователя" })
  async getFavorites(@UserDecorator() user: User) {
    return await this.favoriteService.getFavoritesOfUser(user.id_user);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(CheckToken)
  @ApiOperation({ summary: "Добавить медиа в избранное" })
  async addFavorite(
    @UserDecorator() user: User,
    @Body(ValidationPipe) id_media: number,
  ) {
    return await this.favoriteService.addFavorite(user.id_user, id_media);
  }

  @Delete(":id_favorite")
  @ApiBearerAuth()
  @UseGuards(CheckToken)
  @ApiOperation({ summary: "Удалить медиа из избранного" })
  @ApiParam({
    name: "id_favorite",
    type: Number,
    description: "ID записи избранного",
  })
  async removeFavorite(
    @UserDecorator() user: User,
    @Param("id_favorite", ParseIntPipe) id_favorite: number,
  ) {
    return await this.favoriteService.removeFavorite(id_favorite, user.id_user);
  }

  @Get("check/:id_media")
  @ApiBearerAuth()
  @UseGuards(CheckToken)
  @ApiOperation({ summary: "Проверить, добавлено ли медиа в избранное" })
  @ApiParam({ name: "id_media", type: Number, description: "ID медиа" })
  async checkFavorite(
    @UserDecorator() user: User,
    @Param("id_media", ParseIntPipe) id_media: number,
  ) {
    const isFavorite = await this.favoriteService.checkIfFavorite(
      user.id_user,
      id_media,
    );
    return {
      success: true,
      isFavorite,
      msg: isFavorite ? "Медиа в избранном" : "Медиа не в избранном",
    };
  }
}
