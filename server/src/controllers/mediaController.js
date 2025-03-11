const { modelReview } = require("../models/modelReview.js");
const { modelUser } = require("../models/modelUser");
const { modelMedia } = require("../models/modelMedia.js");
const { modelPopularMovie } = require("../models/modelPopularMovie");
const responseHandler = require("../handlers/response.handler.js");
const sequelize = require("../models/database").sequelize;
const tokenMiddleware = require("../middlewares/middleware.js");
const similarController = require("../controllers/similarController.js");
const keywordController = require("../controllers/keywordController.js");
const { where } = require("sequelize");
const { Op } = require("sequelize");
const { swaggerAPI } = require("../swagger/swagger.api");
//Получение списка проектов
const getMedias = async (req, res) => {
  //curl GET "http://localhost:8000/medias/medias?mediaType=FILM&page=1&limit=10"
  try {
    // Извлекаем параметры из объекта запроса
    const mediaType = req.query.mediaType;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit; //Расчёт смещения

    // Запрос к базе данных
    const { count, rows } = await modelMedia.findAndCountAll({
      where: { mediaType: mediaType },
      limit: limit, // Устанавливаем лимит
      offset: offset, // Устанавливаем смещение
      order: [["id_media", "DESC"]], // Сортировка по id_media по убыванию
    });

    responseHandler.goodrequest(res, {
      total: count, // Общее количество записей
      page: page, // Текущая страница
      limit: limit, // Лимит на странице
      medias: rows, // Массив медиа-контента
    });
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};
//Для добавления медиа
const modelMediaCreate = async (newMedia) => {
  try {
    const result = await modelMedia.create({
      id_media: newMedia.kinopoiskId,
      title: newMedia.nameRu,
      mediaType: newMedia.type,
      country: newMedia.countries.map((c) => c.country).join(", "), //список фильмов
      year: newMedia.year,
      genre: newMedia.genres.map((g) => g.genre).join(", "), //список жанров
      running_time: newMedia.filmLength,
      rars: newMedia.ratingAgeLimits
        ? `${newMedia.ratingAgeLimits.replace(/\D/g, "")}+`
        : null, //удаление всех нечисловых символов и добавление плюса на конце
      rating: newMedia.ratingImdb || null,
      descrition: newMedia.description || null,
      cover: newMedia.coverUrl || newMedia.posterUrl,
    });
    sequelize.sync();
    return result;
  } catch (error) {
    if (error.name == "SequelizeUniqueConstraintError") {
      return { error: "Такой фильм уже существует!" };
    } else {
      console.error("Ошибка при создании медиа:", error);
      return { error: "Ошибка при создании медиа" }; // Возвращаем null в случае других ошибок
    }
  }
};
//Добавление медиа по id
const addMedia = async (req, res) => {
  //curl -X POST "http://localhost:8000/medias/addMedia" -H "Content-Type: application/json" -d '{"id_media": "828"}'
  const { id_media } = req.body;
  const newMedia = await swaggerAPI.mediaByID({ id: id_media });
  // try {
  const result = await modelMediaCreate(newMedia);

  responseHandler.goodrequest(res, result);
};
//Установка списка популярных фильмов
const setPopularMovie = async (req, res) => { //curl GET "http://localhost:8000/medias/popularMovies" 
  const topMedias = await swaggerAPI.mediaCollections({
    type: "TOP_POPULAR_MOVIES",
    page: 3,
  });
  console.log(topMedias.items.length);
  const addedMedias = []; // Массив для добавленных медиа
  const errors = [];
  //Promise.all, чтобы дождаться завершения всех асинхронных операций
  await Promise.all(
    topMedias.items.map(async (item) => {
      if (item.nameRu !== null) {
        try {
          //Создание медиа
          let result = await modelMediaCreate(item);
          // Возникла ошибка
          if (result && result.error) {
            
            if (!result.error.includes("Такой фильм уже существует!")) {
              errors.push(result.error);
            } else {
              // Если фильм уже существует, то его нужно найти в базе данных
              const existingMedia = await modelMedia.findOne({
                where: { id_media: item.kinopoiskId },
              });
              if (existingMedia) {
                result = existingMedia;
                console.log(
                  "Фильм уже существует, поэтому используется текущая запись"
                );
              }
            }
          }
          if (result && !result.error) {
            console.log("Популярный фильм добавлен!");
            addedMedias.push(result);
          } else {
            console.log("Фильм не был добавлен");
          }
        } catch (error) {
          console.error("Произошла неожиданная ошибка:", error);
          errors.push("Произошла неожиданная ошибка");
        }
      }
    })
  );
   // Добавление в PopularMovie первых 10 добавленных фильмов
   //const popularMoviesToAdd = addedMedias.slice(0, 10);
   try {
    // Получение текущих записей из PopularMovie
    const currentPopularMovies = await modelPopularMovie.findAll();
    const currentIds = currentPopularMovies.map((movie) => movie.id_media);

    // Берутся первые 10 id из популярных фильмов для добавления
    const newIds = addedMedias.map((media) => media.id_media).slice(0, 10);

    // Остаются только те записи, которые есть в новом списке
    const idsToKeep = currentIds.filter((id) => newIds.includes(id));

    // Определяются id, которых ещё нет в текущих записях
    const idsToUpdate = newIds.filter((id) => !idsToKeep.includes(id));

    //Обновляются записи, которых нет в newIds
    await Promise.all(
      currentPopularMovies.map(async (media, index) => {
        if (index < idsToUpdate.length) {
          const newId = idsToUpdate[index];
          await media.update({ id_media: newId });
          console.log(`Фильм с id ${media.id_media} обновлен на ${newId}`);
        }
      })
    );
     // Теперь добавляются новые
     await Promise.all(
      idsToAdd.map(async (id) => {
        await modelPopularMovie.create({ id_media: id });
        console.log(`Фильм с id ${id} добавлен в PopularMovie`);
      })
    );
   } catch (error) {
     console.error("Ошибка при добавлении в PopularMovie:", error);
     errors.push("Ошибка при добавлении в PopularMovie");
   }
  if (addedMedias.length == 0) {
    console.log("Ошибки:", errors);
    responseHandler.error(res, "Медиа не добавлены!");
  } else {
    responseHandler.goodrequest(res, addedMedias);
  }
};

const getMediasByType = async (req, res) => {
  try {
    const mediaType = req.query.mediaType || "FILM";

    const medias = await modelMedia.findAll({
      where: { mediaType: mediaType }, //Поиск по mediaType
      order: [["id_media", "DESC"]],
    });
    console.log("Медиа получены успешно");

    return responseHandler.goodrequest(res, medias); // Отправляем ответ с найденными жанрами
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};
//Получение жанров
// curl GET "http://localhost:8000/medias/genres?mediaType=FILM"
const getGenres = async (req, res) => {
  try {
    const mediaType = req.query.mediaType || "FILM";
    console.log(mediaType);

    const medias = await modelMedia.findAll({
      where: { mediaType: mediaType }, //Поиск по mediaType
    });
    console.log("Медиа получены успешно");
    const genresSet = new Set(); // Set используется для уникальности жанров

    medias.forEach((media) => {
      if (media.genre) {
        // Проверяем, есть ли жанры
        const genresArray = media.genre.split(","); // Жанры разделены запятыми
        genresArray.forEach((genre) => genresSet.add(genre.trim())); // Добавление жанров в Set
      }
    });

    const genres = Array.from(genresSet); // Преобразование Set в массив

    if (genres.length === 0) {
      return responseHandler.notfound(res);
    }

    return responseHandler.goodrequest(res, genres); // Отправляем ответ с найденными жанрами
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};
//Получение информации о проекте
const getInfo = async (req, res) => {
  //curl GET "http://localhost:8000/medias/info?id_media=1392743"
  try {
    const id_media = req.query.id_media;
    console.log(id_media);
    const media = await modelMedia.findByPk(id_media);
    //const similar = await similarController.getSimilarMedia(id_media);

    //Тоже самое для изображений

    const tokenDecoded = tokenMiddleware.decode(req);
    let user = null;
    if (tokenDecoded) {
      //Проверка работы decode
      user = await modelUser.findByPk(tokenDecoded.data);
    }
    //Добавить получения отзывов о проекте
    const reviews = await modelReview.findAll({
      where: { id_media: id_media },
      order: [["id_review", "DESC"]], // Сортируем отзывы по дате создания (по убыванию)
    });

    responseHandler.goodrequest(res, {
      media, //информация о проекте
      //similar, //информация о похожих проектах
      reviews, //информация о обзорах
      user,
    });
    responseHandler.goodrequest(res, media);
  } catch (error) {
    console.log(error);
    responseHandler.error(res);
  }
};

// Функция для поиска медиа
// curl -X POST "http://localhost:8000/media/search" -H "Content-Type: application/json" -d '{"userQuerry": "фильм про зеленого чувака, который крадёт Рождество и он злой"}'
const search = async (req, res) => {
  try {
    const { userQuerry } = req.body;
    const searchResult = await keywordController.search(userQuerry);
    const scoreMap = searchResult.reduce((acc, item) => {
      acc[item.id_media] = item.score;
      return acc;
    }, {});
    const mediaIds = searchResult.map((item) => item.id_media); //Извлечение id из списка результата
    const mediaList = await modelMedia.findAll({
      where: {
        id_media: {
          [Op.in]: mediaIds,
        },
      },
    });
    const mediaListWithScore = mediaList.map((media) => {
      const mediaJSON = media.toJSON(); // Преобразуем объект Sequelize в обычный JSON
      return {
        ...mediaJSON,
        score: scoreMap[media.id_media] || 0, // Добавляем score, если он есть, иначе 0
      };
    });
    mediaListWithScore.sort((a, b) => b.score - a.score);
    responseHandler.goodrequest(res, mediaListWithScore);
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

module.exports = {
  getMedias,
  addMedia,
  getGenres,
  getMediasByType,
  getInfo,
  setPopularMovie,
  search,
};
//curl -X GET http://localhost:8000/api/medias?page=1&limit=10
//curl -X GET http://localhost:8000/medias?page=1&limit=10
//curl -X POST http://localhost:8000/medias -H "Content-Type: application/json" -d '{"page": 1}'
//curl -X POST http://localhost:8000/medias/genres -H "Content-Type: application/json" -d '{"mediaType": 'FILM'}'
//curl -X POST "http://localhost:8000/genres" -H "Content-Type: application/json" -d '{"mediaType": "FILM"}'
