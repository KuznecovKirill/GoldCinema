// src/database/schema/keyword.schema.ts
import { mysqlTable, int, text } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { mediaTable } from "./media.schema";

export const keywordTable = mysqlTable("Keyword", {
  idKeyword: int("id_keyword").primaryKey().autoincrement(),
  idMedia: int("id_media").notNull(),
  keywords: text("keywords"),
});

export const keywordRelations = relations(keywordTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [keywordTable.idMedia],
    references: [mediaTable.idMedia],
  }),
}));

export type Keyword = typeof keywordTable.$inferSelect;
export type NewKeyword = typeof keywordTable.$inferInsert;