import { mysqlTable, int, varchar, text, float, decimal } from "drizzle-orm/mysql-core";

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

export type Media = typeof mediaTable.$inferSelect;
export type NewMedia = typeof mediaTable.$inferInsert;