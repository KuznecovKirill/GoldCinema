const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./database").sequelize;

//Модель медиа
const modelMedia_Genre = sequelize.define(
  "Media_Genre",
  {
    id_media_genre: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_media: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_genre: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

modelMedia_Genre.prototype.toObject = function () {
  const values = { ...this.get() };
  return values;
};

// Преобразование в JSON
modelMedia_Genre.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};

async () => {
    await sequelize.sync({ alter: true });
    //await sequelize.sync();
  };

module.exports = { modelMedia_Genre };