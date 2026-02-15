
import { mysqlTable, int } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { mediaTable } from "./media.schema";
import { genreTable } from "./genre.schema";
import { countryTable } from "./country.schema";

export const mediaCountryTable = mysqlTable("Media_Country", {
  idMediaCountry: int("id_media_country").primaryKey().autoincrement(),
  idMedia: int("id_media").notNull(),
  idCountry: int("id_country").notNull(),
});

export const mediaGenreRelations = relations(mediaCountryTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [mediaCountryTable.idMedia],
    references: [mediaTable.idMedia],
  }),
  genre: one(countryTable, {
    fields: [mediaCountryTable.idCountry],
    references: [countryTable.idCountry],
  }),
}));

export type MediaGenre = typeof mediaCountryTable.$inferSelect;
export type NewMediaGenre = typeof mediaCountryTable.$inferInsert;