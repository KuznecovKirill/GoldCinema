const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./database").sequelize;
const crypto = require("crypto");

//Модель пользователя
const modelRole = sequelize.define(
  "Role",
  {
    id_role: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name_role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

modelRole.prototype.toObject = function () {
  const values = { ...this.get() };
  delete values.id_user; // Исправлено на id_user
  return values;
};

// Преобразование в JSON
modelRole.prototype.toJSON = function () {
  const values = { ...this.get() };
  // delete values.id_user;
  return values;
};

(async () => {
  // Синхронизация моделей с базой данных без удаления существующих данных
  await sequelize.sync();
})();


module.exports = { modelRole };