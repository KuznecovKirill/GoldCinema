import { mysqlTable, int } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { mediaTable } from "./media.schema";

export const similarTable = mysqlTable("similar", {
  idSimilar: int("id_similar").primaryKey().autoincrement(),
  idOrigin: int("id_origin").notNull(),
  idMedia: int("id_media").notNull(),
});

export const similarRelations = relations(similarTable, ({ one }) => ({
  origin: one(mediaTable, {
    fields: [similarTable.idOrigin],
    references: [mediaTable.idMedia],
    relationName: "origin",
  }),
  media: one(mediaTable, {
    fields: [similarTable.idMedia],
    references: [mediaTable.idMedia],
    relationName: "similarMedia",
  }),
}));

export type Similar = typeof similarTable.$inferSelect;
export type NewSimilar = typeof similarTable.$inferInsert;