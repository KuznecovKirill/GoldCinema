// src/database/schema/image.schema.ts
import { mysqlTable, int, varchar, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { mediaTable } from "./media.schema";

export const imageTable = mysqlTable("Image", {
  idImage: int("id_image").primaryKey().autoincrement(),
  idMedia: int("id_media").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  isAnalyzed: boolean("is_analyzed"),
});

export const imageRelations = relations(imageTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [imageTable.idMedia],
    references: [mediaTable.idMedia],
  }),
}));

export type Image = typeof imageTable.$inferSelect;
export type NewImage = typeof imageTable.$inferInsert;