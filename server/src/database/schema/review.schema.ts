// src/database/schema/review.schema.ts
import { mysqlTable, int, smallint, text, timestamp } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { userTable } from "./user.schema";
import { mediaTable } from "./media.schema";

export const reviewTable = mysqlTable("Review", {
  idReview: int("id_review").primaryKey().autoincrement(),
  idUser: int("id_user").notNull(),
  idMedia: int("id_media").notNull(),
  ratingUser: smallint("rating_user").notNull(),
  commentText: text("comment_text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviewRelations = relations(reviewTable, ({ one }) => ({
  user: one(userTable, {
    fields: [reviewTable.idUser],
    references: [userTable.idUser],
  }),
  media: one(mediaTable, {
    fields: [reviewTable.idMedia],
    references: [mediaTable.idMedia],
  }),
}));

export type Review = typeof reviewTable.$inferSelect;
export type NewReview = typeof reviewTable.$inferInsert;