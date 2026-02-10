// src/database/schema/genre.schema.ts
import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";
import { mediaGenreTable } from "./media-genre.schema";
import { relations } from "drizzle-orm";

export const genreTable = mysqlTable("Genre", {
  idGenre: int("id_genre").primaryKey().autoincrement(),
  nameGenre: varchar("name_genre", { length: 255 }),
});

export const genreRelations = relations(genreTable, ({ many }) => ({
  // Many-to-Many с медиа через связующую таблицу
  media: many(mediaGenreTable),
}));

export type Genre = typeof genreTable.$inferSelect;
export type NewGenre = typeof genreTable.$inferInsert;