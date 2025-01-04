const { Sequelize } = require("sequelize");
const modelUser = require("./modelUser"); // Импорт модели пользователя
const { swaggerAPI } = require("../swagger/swagger.api");
const { modelMedia } = require("./modelMedia");
const { modelSimilar } = require("./modelSimilar");
const { modelImages } = require("./modelImages");
require("dotenv").config();

const sequelize = require("./database").sequelize;

//Получение фильма по ID
async function addMovie(newMedia) {
  // const newMedia = await swaggerAPI.mediaByID({ id: 301 });
  console.log(newMedia);
  try {
    await modelMedia.create({
      id_media: newMedia.kinopoiskId,
      title: newMedia.nameRu,
      mediaType: newMedia.type,
      country: newMedia.countries.map((c) => c.country).join(", "), //список фильмов
      year: newMedia.year,
      genre: newMedia.genres.map((g) => g.genre).join(", "), //список жанров
      running_time: newMedia.filmLength,
      rars: `${newMedia.ratingAgeLimits.replace(/\D/g, "")}+`, //удаление всех нечисловых символов и добавление плюса на конце
      rating: newMedia.ratingImdb,
      descrition: newMedia.description,
      poster: newMedia.posterUrlPreview,
    });
  } catch (error) {
    if (error.name == "SequelizeUniqueConstraintError") {
      console.log("Такой фильм уже существует!");
    }
  }
  sequelize.sync();
}
//Получение списка фильмов
async function getMovies() {
  const newCollection = await swaggerAPI.mediaCollections({
    type: "TOP_POPULAR_ALL",
    page: "3",
  });
  newCollection.items.forEach(async (item) => {
    if (item.nameRu !== null) {
      // console.log(item.nameRu);
      try {
        await modelMedia.create({
          id_media: item.kinopoiskId,
          title: item.nameRu,
          mediaType: item.type,
          country: item.countries.map((c) => c.country).join(", "),
          year: item.year,
          genre: item.genres.map((g) => g.genre).join(", "),
          running_time: item.filmLength || null,
          rars: item.ratingAgeLimits
            ? `${item.ratingAgeLimits.replace(/\D/g, "")}+`
            : null,
          rating: item.ratingImdb || null,
          descrition: item.description || null,
          poster: item.posterUrlPreview || null,
        });
      } catch (error) {
        if (error.name == "SequelizeUniqueConstraintError") {
          console.log("Такой фильм уже существует!");
        }
      }
    }
  });
  sequelize.sync();
}
//Получение изображений медиа
async function getImages() {
  const newImage = await swaggerAPI.mediaImages(
    { id: "957887/" },
    { images: "images?", type: "SCREENSHOT", page: "1" }
  );
  console.log(newImage);
  const firstSixImages = newImage.items.slice(0, 6);
  for (const item of firstSixImages) {
    try {
      await modelImages.create({
        id_media: 464963,
        imageUrl: item.imageUrl,
      });
    } catch (error) {
      if (error instanceof Sequelize.UnknownConstraintError) {
        console.log("Отлов ошибки изображения!");
      }
    }
  }
  sequelize.sync();
}

//Получение похожих проектов
async function getSimilars() {
  const newSimilar = await swaggerAPI.mediaSimilars(
    { id: "957887/" },
    { similars: "similars" }
  );
  console.log(newSimilar);
  const firstSixMovies = newSimilar.items.slice(0, 6);
  for (const item of firstSixMovies) {
    if (item.nameRu !== null) {
      const newMedia = await swaggerAPI.mediaByID({ id: item.filmId }); // Добавление фильма в БД
      addMovie(newMedia);
      await modelSimilar.create({
        id_origin: 957887,
        id_media: item.filmId || null,
        title: item.nameRu,
        poster: item.posterUrlPreview,
      });
    }
  }
  sequelize.sync();
}
//getSimilars();
getMovies();
getSimilars();
// getMovie();
//getImages();
(async () => {
  // Синхронизация моделей с базой данных без удаления существующих данных
  await sequelize.sync({ alter: true });
})();
module.exports = {getMovies};
