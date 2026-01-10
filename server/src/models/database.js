// database.js
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("Gold_Cinema", "root", "", {
  dialect: "mysql",
  host: "MySQL-8.0",
  port: "3306",
});
try {
  sequelize.authenticate();
  console.log("Соединение с БД было успешно установлено");
} catch (e) {
  console.log("Невозможно выполнить подключение к БД: ", e);
}

module.exports = { sequelize };
