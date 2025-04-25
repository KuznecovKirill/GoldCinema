const { DataTypes } = require("sequelize");
const { modelUser } = require("./modelUser");
const { modelMedia } = require("./modelMedia");
const sequelize = require("./database").sequelize;

//Модель отзыва
const modelReview = sequelize.define(
  "Review",
  {
    id_review: {
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
      allowNull: false,
    },
    id_media: {
      type: DataTypes.INTEGER,
      references: {
        model: modelMedia,
        key: 'id_media'
      },
      allowNull: false,
    },
    rating_user: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);


modelReview.belongsTo(modelUser, {
  foreignKey: 'id_user',
  targetKey: 'id_user',
  as: 'user'
});
modelReview.belongsTo(modelMedia, {
  foreignKey: 'id_media',
  targetKey: 'id_media',
  as: 'media'
});
modelReview.prototype.toObject = function () {
  const values = { ...this.get() };
  return values;
};

// Преобразование в JSON
modelReview.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};
(async () => {
  // Синхронизация моделей с базой данных без удаления существующих данных
  await sequelize.sync({ alter: true });
})();
module.exports = { modelReview };
