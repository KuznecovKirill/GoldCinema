const { Sequelize, DataTypes } = require("sequelize");
const { modelUser } = require("./modelUser");
const sequelize = require("./database").sequelize;

//Модель пользователя
const modelFavorite = sequelize.define(
  "Favorite",
  {
    id_favorite: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      references: {
        model: modelUser,
        key: "id_user",
      },
    },
    id_media: {
      type: DataTypes.INTEGER,
      // references: {
      //     // model: modelUser,
      //     // key: 'id_user'
      // }
    },
    media_poster:{
        type: DataTypes.STRING,
        allowNull: false
    },
    media_rating:{
        type: DataTypes.FLOAT,
        allowNull: false
    }
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
module.exports = {modelFavorite};
