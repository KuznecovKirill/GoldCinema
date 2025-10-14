const { DataTypes } = require("sequelize");
const sequelize = require("./database").sequelize;
//Модель медиа
const modelMedia = sequelize.define(
  "Media",
  {
    id_media: {
      type: DataTypes.INTEGER,
      autoIncrement: false,
      primaryKey: true,
      allowNull: false,
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
    cover: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
modelMedia.prototype.toObject = function () {
  const values = { ...this.get() };
  return values;
};

// Преобразование в JSON
modelMedia.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};

modelMedia.prototype.getWords = (function (media) {
  let json = JSON.stringify(media);
  const combinetedText = `${this.title} ${this.description} ${this.genre}`;

  const wordsArray = combinetedText
    .toLowerCase() 
    .match(/\b\w+\b/g) 
    .filter((word, index, self) => self.indexOf(word) === index); 
  return wordsArray;

})(async () => {
  await sequelize.sync({ alter: true });
});

module.exports = { modelMedia };
