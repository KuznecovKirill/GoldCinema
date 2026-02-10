import { mysqlTable, int, varchar, text, float, decimal } from "drizzle-orm/mysql-core";
import { mediaGenreTable } from "./media-genre.schema";
import { reviewTable } from "./review.schema";
import { imageTable } from "./image.schema";
import { keywordTable } from "./keyword.schema";
import { favoriteTable } from "./favorite.schema";
import { popularMovieTable } from "./popular-movie.schema";
import { popularSeriesTable } from "./popular-series.schema";
import { similarTable } from "./similar.schema";
import { relations } from "drizzle-orm";

export const mediaTable = mysqlTable("Media", {
  idMedia: int("id_media").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  mediaType: varchar("media_type", { length: 50 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  year: varchar("year", { length: 4 }),
  runningTime: int("running_time"),
  rars: varchar("rars", { length: 10 }),
  rating: decimal("rating", { precision: 3, scale: 1 }),
  descrition: text("descrition"),
  cover: varchar("cover", { length: 500 }).notNull(),
});

export const mediaRelations = relations(mediaTable, ({ many, one }) => ({
  // Many-to-Many с жанрами через связующую таблицу
  genres: many(mediaGenreTable),
  //One-to-One
  keywords: one(keywordTable),
  // One-to-Many отношения
  reviews: many(reviewTable),
  images: many(imageTable),
  favorites: many(favoriteTable),
  popularMovies: many(popularMovieTable),
  popularSeries: many(popularSeriesTable),
  
  // Для таблицы similar (похожие медиа)
  originSimilar: many(similarTable, { relationName: "origin" }),
  similarMedia: many(similarTable, { relationName: "similarMedia" }),
}));

export type Media = typeof mediaTable.$inferSelect;
export type NewMedia = typeof mediaTable.$inferInsert;