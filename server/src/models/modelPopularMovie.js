const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./database").sequelize;
const { modelMedia } = require("./modelMedia");
//Модель для популярных фильмов
const modelPopularMovie = sequelize.define(
  "PopularMovie",
  {
    id_popular_movie: {
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
modelPopularMovie.belongsTo(modelMedia, {
  foreignKey: 'id_media',
  targetKey: 'id_media',
  onDelete: 'CASCADE'
});
modelPopularMovie.prototype.toObject = function () {
  const values = { ...this.get() };
  return values;
};

// Преобразование в JSON
modelPopularMovie.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};

async () => {
  // await sequelize.sync({ alter: true });
  await sequelize.sync();
};

module.exports = { modelPopularMovie };
