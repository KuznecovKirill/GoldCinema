const { DataTypes } = require("sequelize");
const { modelMedia } = require("./modelMedia");
const sequelize = require("./database").sequelize;

//Модель похожих проектов
const modelSimilar = sequelize.define(
  "Similar",
  {
    id_similar: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_origin: {
      type: DataTypes.INTEGER,
      references: {
        model: modelMedia,
        key: "id_media",
      },
    },
    id_media: {
      type: DataTypes.INTEGER,
      references: {
        model: modelMedia,
        key: "id_media",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

modelSimilar.prototype.toObject = function () {
  const values = { ...this.get() };
  return values;
};

// Преобразование в JSON
modelSimilar.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};
(async () => {
  // Синхронизация моделей с базой данных без удаления существующих данных
  //await sequelize.sync();
  await sequelize.sync();
})();
module.exports = { modelSimilar };
