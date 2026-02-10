import { mysqlTable, int } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { mediaTable } from "./media.schema";

export const popularMovieTable = mysqlTable("popular_movie", {
  idPopularMovie: int("id_popular_movie").primaryKey().autoincrement(),
  idMedia: int("id_media").notNull(),
});

export const popularMovieRelations = relations(popularMovieTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [popularMovieTable.idMedia],
    references: [mediaTable.idMedia],
  }),
}));

export type PopularMovie = typeof popularMovieTable.$inferSelect;
export type NewPopularMovie = typeof popularMovieTable.$inferInsert;