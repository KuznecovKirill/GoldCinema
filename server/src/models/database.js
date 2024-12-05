// database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("Gold_Cinema", "root", "", {
    dialect: "mysql",
    host: "MySQL-8.0",
    port: "8000"
  });

module.exports = sequelize;