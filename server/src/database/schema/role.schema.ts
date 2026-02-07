import { mysqlTable, smallint, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { userTable } from "./user.schema";

export const roleTable = mysqlTable("role", {
  idRole: smallint("id_role").primaryKey().autoincrement(),
  nameRole: varchar("name_role", { length: 255 }).notNull(),
});
export const roleRelation = relations(roleTable, ({ many }) => ({
  user: many(userTable),
}));
// Типы для TypeScript
export type Role = typeof roleTable.$inferSelect;
export type NewRole = typeof roleTable.$inferInsert;
