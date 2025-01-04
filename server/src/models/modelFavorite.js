const { DataTypes } = require("sequelize");
const { modelUser } = require("./modelUser");
const sequelize = require("./database").sequelize;

//Модель избранного
const modelFavorite = sequelize.define(
  "Favorite",
  {
    id_favorite: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_user:{
      type: DataTypes.INTEGER,
      references: {
        model: modelUser,
        key: "id_user",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    running_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rars: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    descrition: {
      type: DataTypes.TEXT,
      allowNull: true,
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

modelFavorite.prototype.toObject = function () {
  const values = { ...this.get() };
  return values;
};

// Преобразование в JSON
modelFavorite.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};
(async () => {
  // Синхронизация моделей с базой данных без удаления существующих данных
  await sequelize.sync();
})();
module.exports = { modelFavorite };
