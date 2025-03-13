const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./database").sequelize;
const { modelMedia } = require("./modelMedia");
//Модель для популярных сериалов
const modelPopularSeries = sequelize.define(
  "PopularSeries",
  {
    id_popular_series: {
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
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

modelPopularSeries.prototype.toObject = function () {
  const values = { ...this.get() };
  return values;
};

// Преобразование в JSON
modelPopularSeries.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};

async () => {
  //await sequelize.sync({ alter: true });
  await sequelize.sync();
};

module.exports = { modelPopularSeries };
