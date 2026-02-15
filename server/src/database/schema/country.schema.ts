import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";
import { mediaGenreTable } from "./media-genre.schema";
import { relations } from "drizzle-orm";
import { mediaCountryTable } from "./media-country.schema";

export const countryTable = mysqlTable("Country", {
  idCountry: int("id_country").primaryKey().autoincrement(),
  nameCountry: varchar("name_country", { length: 50 }),
});

export const genreRelations = relations(countryTable, ({ many }) => ({
  // Many-to-Many с медиа через связующую таблицу
  media: many(mediaCountryTable),
}));

export type Genre = typeof countryTable.$inferSelect;
export type NewGenre = typeof countryTable.$inferInsert;