import { Controller, Post, Delete, Get, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CheckToken } from '@/middlewares/middleware';
import { UserDecorator } from "@/decorators/user.decorator";
import { KeywordService } from '@/modules/keyword/keyword.service';
import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { User } from '@/database/schema';

const CreateReviewSchema = z.object({
     id_media: z.number().min(1),
     rating_user: z.number().min(1),
    comment_text: z.string().min(3),
})
export class CreateReview extends createZodDto(CreateReviewSchema) {}

@ApiTags('REVIEWS')
@Controller('api/reviews')
@ApiBearerAuth()
@UseGuards(CheckToken)
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly keywordService: KeywordService, // для асинхронного обновления ключевых слов
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать отзыв' })
  async create(@UserDecorator() user: User, @Body() dto: CreateReview) {
    const review = await this.reviewService.create(
      user.idUser,
      dto.id_media,
      dto.rating_user,
      dto.comment_text,
    );
    // Асинхронно обновляем ключевые слова
    this.keywordService.addInfo(dto.id_media).catch(console.error);
    return review;
  }

  @Delete(':id_review')
  @ApiOperation({ summary: 'Удалить отзыв' })
  async remove(@UserDecorator() user: User, @Param('id_review', ParseIntPipe) id_review: number) {
    await this.reviewService.remove(id_review, user.idUser);
    return { success: true, message: 'Отзыв удален' };
  }

  @Get()
  @ApiOperation({ summary: 'Мои отзывы' })
  async getMyReviews(@UserDecorator() user: User) {
    return this.reviewService.getUserReviews(user.idUser);
  }
}