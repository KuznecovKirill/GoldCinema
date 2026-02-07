const sequelize = require("./database").sequelize;
import crypto from "crypto";

import {
    int,
  mysqlTable,
  smallint,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { roleTable } from "./role.schema";

export const userTable = mysqlTable("user", {
  idUser: int("id_user").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  salt: varchar("salt", { length: 64 }),
  idRole: smallint("id_role").notNull().default(1), // По умолчанию обычный пользователь
});

export const userRelation = relations(userTable, ({one}) => ({
    role: one(roleTable, {
        fields: [userTable.idRole],
        references: [roleTable.idRole],
    }),
}))
// Типы для TypeScript
export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;


// Метод для установки пароля
modelUser.prototype.setPassword = async function (password) {
  this.password = password;

  this.passToken = crypto
    .pbkdf2Sync(
      password,
      crypto.randomBytes(8).toString("hex"),
      1000,
      32,
      "sha512",
    )
    .toString("hex");
  console.log(this.passToken);
};

// Метод для проверки пароля
modelUser.prototype.validPassword = async function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.passToken.substring(0, 16), 1000, 32, "sha512")
    .toString("hex");
  return hash === this.passToken;
};

modelUser.prototype.toObject = function () {
  const values = { ...this.get() };
  delete values.id_user; // Исправлено на id_user
  return values;
};

// Преобразование в JSON
modelUser.prototype.toJSON = function () {
  const values = { ...this.get() };
  // delete values.id_user;
  return values;
};

//Проверка, что данный пользователь - это администратор
modelUser.prototype.isAdmin = function () {
  return this.id_role === 2;
};

(async () => {
  // Синхронизация моделей с базой данных без удаления существующих данных
  await sequelize.sync();
})();
module.exports = { modelUser };
