// src/database/schema/genre.schema.ts
import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";

export const genreTable = mysqlTable("Genre", {
  idGenre: int("id_genre").primaryKey().autoincrement(),
  nameGenre: varchar("name_genre", { length: 255 }),
});

export type Genre = typeof genreTable.$inferSelect;
export type NewGenre = typeof genreTable.$inferInsert;