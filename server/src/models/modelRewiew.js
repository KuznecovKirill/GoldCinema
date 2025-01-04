const { Sequelize, DataTypes } = require("sequelize");
const { modelUser } = require("./modelUser");
const { modelMedia } = require("./modelMedia");
const sequelize = require("./database").sequelize;

//Модель отзыва
const modelRewiew = sequelize.define(
  "Rewiew",
  {
    id_rewiew: {
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
      references: {
        model: modelMedia,
        key: 'id_media'
      }
    },
    rating_user: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

modelRewiew.prototype.toObject = function () {
  const values = { ...this.get() };
  return values;
};

// Преобразование в JSON
modelRewiew.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};
(async () => {
  // Синхронизация моделей с базой данных без удаления существующих данных
  await sequelize.sync();
})();
module.exports = { modelRewiew };
