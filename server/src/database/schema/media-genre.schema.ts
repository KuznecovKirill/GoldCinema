// src/database/schema/media-genre.schema.ts
import { mysqlTable, int } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { mediaTable } from "./media.schema";
import { genreTable } from "./genre.schema";

export const mediaGenreTable = mysqlTable("Media_Genre", {
  idMediaGenre: int("id_media_genre").primaryKey().autoincrement(),
  idMedia: int("id_media").notNull(),
  idGenre: int("id_genre").notNull(),
});

export const mediaGenreRelations = relations(mediaGenreTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [mediaGenreTable.idMedia],
    references: [mediaTable.idMedia],
  }),
  genre: one(genreTable, {
    fields: [mediaGenreTable.idGenre],
    references: [genreTable.idGenre],
  }),
}));

export type MediaGenre = typeof mediaGenreTable.$inferSelect;
export type NewMediaGenre = typeof mediaGenreTable.$inferInsert;