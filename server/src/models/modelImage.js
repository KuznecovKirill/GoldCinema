const { DataTypes } = require("sequelize");
const { modelMedia } = require("./modelMedia");
const sequelize = require("./database").sequelize;

//Модель кадров медиа-проектов
const modelImage = sequelize.define(
  "Image",
  {
    id_image: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_media: {
      type: DataTypes.INTEGER,
      references: {
        model: modelMedia,
        key: "id_media",
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

modelImage.prototype.toObject = function () {
  const values = { ...this.get() };
  return values;
};

// Преобразование в JSON
modelImage.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};
(async () => {
  // Синхронизация моделей с базой данных без удаления существующих данных
  await sequelize.sync();
  //await sequelize.sync({ alter: true });
})();
module.exports = { modelImage };