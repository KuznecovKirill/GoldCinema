import { mysqlTable, int } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { mediaTable } from "./media.schema";

export const popularSeriesTable = mysqlTable("Popular_Series", {
  idPopularSeries: int("id_popular_series").primaryKey().autoincrement(),
  idMedia: int("id_media").notNull(),
});

export const popularSeriesRelations = relations(popularSeriesTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [popularSeriesTable.idMedia],
    references: [mediaTable.idMedia],
  }),
}));

export type PopularSeries = typeof popularSeriesTable.$inferSelect;
export type NewPopularSeries = typeof popularSeriesTable.$inferInsert;