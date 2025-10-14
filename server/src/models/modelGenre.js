const { DataTypes } = require("sequelize");
const sequelize = require("./database").sequelize;

//Модель медиа
const modelGenre = sequelize.define(
  "Genre",
  {
    id_genre: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name_genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
modelGenre.prototype.toObject = function () {
  const values = { ...this.get() };
  return values;
};

// Преобразование в JSON
modelGenre.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};

async () => {
    await sequelize.sync({ alter: true });
    //await sequelize.sync();
  };
module.exports = { modelGenre };