import { relations } from "drizzle-orm";
import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { userTable } from "./user.schema";
import { mediaTable } from "./media.schema";

export const favoriteTable = mysqlTable("Favorite", {
      idFavorite: int("id_favorite").primaryKey().autoincrement(),
  idUser: int("id_user").notNull(),
  idMedia: int("id_media").notNull(),
});
export const favoriteRelations = relations(favoriteTable, ({ one }) => ({
  user: one(userTable, {
    fields: [favoriteTable.idUser],
    references: [userTable.idUser],
  }),
  media: one(mediaTable, {
    fields: [favoriteTable.idMedia],
    references: [mediaTable.idMedia],
  }),
}));

export type Favorite = typeof favoriteTable.$inferSelect;
export type NewFavorite = typeof favoriteTable.$inferInsert;