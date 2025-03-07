const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./database").sequelize;

//Модель медиа
const modelMedia = sequelize.define(
  "Media",
  {
    id_media: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
    cover: {
      type: DataTypes.STRING,
      allowNull: true,
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
  // Разделяем строку на слова с помощью регулярного выражения
  const wordsArray = combinetedText
    .toLowerCase() // Приводим к нижнему регистру для унификации
    .match(/\b\w+\b/g) // Извлекаем все слова (последовательности букв)
    .filter((word, index, self) => self.indexOf(word) === index); // Удаляем дубликаты
  return wordsArray;

})(async () => {
  // Синхронизация моделей с базой данных без удаления существующих данных
  //await sequelize.sync({ alter: true });
  await sequelize.sync();
});

module.exports = { modelMedia };
