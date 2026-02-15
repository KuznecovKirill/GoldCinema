import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DrizzleService } from '@/database/drizzle.service';
import { reviewTable, userTable, mediaTable } from '@/database/schema';
import { eq, desc, and } from 'drizzle-orm';

@Injectable()
export class ReviewService {
  constructor(private readonly drizzleService: DrizzleService) {}

  private get db() {
    return this.drizzleService.db;
  }

  async create(userId: number, mediaId: number, rating: number, comment: string) {
    const [newReview] = await this.db
      .insert(reviewTable)
      .values({
        idUser: userId,
        idMedia: mediaId,
        ratingUser: rating,
        commentText: comment,
        createdAt: new Date(),
      })
      .$returningId();

    const [review] = await this.db
      .select()
      .from(reviewTable)
      .where(eq(reviewTable.idReview, newReview.idReview))
      .limit(1);

      //TODO: Добавить функцию для добавления информации обзора в keyword
    return review;
  }

  async remove(reviewId: number, userId: number) {
    const [review] = await this.db
      .select()
      .from(reviewTable)
      .where(
        and(
          eq(reviewTable.idReview, reviewId),
          eq(reviewTable.idUser, userId),
        ),
      )
      .limit(1);

    if (!review) {
      throw new NotFoundException('Отзыв не найден или не принадлежит пользователю');
    }

    await this.db.delete(reviewTable).where(eq(reviewTable.idReview, reviewId));
    return { success: true, msg: "Отзыв успешно удалён" };
  }

  async getUserReviews(userId: number) {
    const reviews = await this.db
      .select({
        id_review: reviewTable.idReview,
        rating_user: reviewTable.ratingUser,
        comment_text: reviewTable.commentText,
        created_at: reviewTable.createdAt,
        media: {
          id_media: mediaTable.idMedia,
          title: mediaTable.title,
          media_type: mediaTable.mediaType,
          cover: mediaTable.cover,
        },
      })
      .from(reviewTable)
      .innerJoin(mediaTable, eq(reviewTable.idMedia, mediaTable.idMedia))
      .where(eq(reviewTable.idUser, userId))
      .orderBy(desc(reviewTable.idReview));

    return reviews;
  }

  async getMediaReviews(mediaId: number) {
    const reviews = await this.db
      .select({
        id_review: reviewTable.idReview,
        rating_user: reviewTable.ratingUser,
        comment_text: reviewTable.commentText,
        created_at: reviewTable.createdAt,
        user: {
          id_user: userTable.idUser,
          username: userTable.username,
        },
      })
      .from(reviewTable)
      .innerJoin(userTable, eq(reviewTable.idUser, userTable.idUser))
      .where(eq(reviewTable.idMedia, mediaId))
      .orderBy(desc(reviewTable.idReview));

    return reviews;
  }
}