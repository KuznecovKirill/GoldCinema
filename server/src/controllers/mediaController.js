const { modelReview } = require("../models/modelReview.js");
const { modelUser } = require("../models/modelUser");
const { modelMedia } = require("../models/modelMedia.js");
const { modelPopularMovie } = require("../models/modelPopularMovie");
const { modelPopularSeries } = require("../models/modelPopularSeries");

const responseHandler = require("../handlers/response.handler.js");
const sequelize = require("../models/database").sequelize;
const tokenMiddleware = require("../middlewares/middleware.js");
const similarController = require("../controllers/similarController.js");
const keywordController = require("../controllers/keywordController.js");
const { where } = require("sequelize");
const { Op } = require("sequelize");
const { swaggerAPI } = require("../swagger/swagger.api");

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
      return { error: "Такое медиа уже существует!" };
    } else {
      console.error("Ошибка при создании медиа:", error);
      return { error: "Ошибка при создании медиа" }; // Возвращаем null в случае других ошибок
    }
  }
};

//Получение списка проектов
const getMedias = async (req, res) => {
  //curl GET "http://localhost:8000/medias/medias?mediaType=FILM&page=1&limit=10"
  try {
    // Извлекаем параметры из объекта запроса
    const mediaType = req.params.mediaType;
    const mediaCategory = req.params.mediaCategory;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 40;
    const offset = (page - 1) * limit; //Расчёт смещения

    let count;
    let rows;

    // Запрос к базе данных
    // Если нужно получить список популярных
    if (mediaCategory == "popular" && mediaType == "FILM") {
      const popularId = await modelPopularMovie.findAll({
        attributes: ["id_media"],
      }); //список id популярных фильмов
      const popularIdList = popularId.map((item) => item.id_media); //Преобразование в массив
      ({ count, rows } = await modelMedia.findAndCountAll({
        where: { id_media: popularIdList, mediaType: mediaType },
        limit: limit, // Устанавливаем лимит
        offset: offset, // Устанавливаем смещение
        order: [["id_media", "DESC"]], // Сортировка по id_media по убыванию
      }));
    }
    else if (mediaCategory == "popular" && mediaType == "TV_SERIES") {
      const popularId = await modelPopularSeries.findAll({
        attributes: ["id_media"],
      }); //список id популярных сериалов
      const popularIdList = popularId.map((item) => item.id_media); //Преобразование в массив
      ({ count, rows } = await modelMedia.findAndCountAll({
        where: { id_media: popularIdList, mediaType: mediaType },
        limit: limit, // Устанавливаем лимит
        offset: offset, // Устанавливаем смещение
        order: [["id_media", "DESC"]], // Сортировка по id_media по убыванию
      }));
    }
    //Просто список по mediaType
    else {
      ({ count, rows } = await modelMedia.findAndCountAll({
        where: { mediaType: mediaType },
        limit: limit,
        offset: offset,
        order: [["id_media", "DESC"]],
      }));
    }

    responseHandler.goodrequest(res, {
      total: count, // Общее количество записей
      page: page, // Текущая страница
      limit: limit, // Лимит на странице
      medias: rows, // Массив медиа-контента
      mediaType: mediaType
    });
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};
//Получить все медиа
const getAllMedias = async (req, res) => {
  try {
    const medias = await modelMedia.findAll();

    responseHandler.goodrequest(res, medias);
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
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
//Установка популярных медиа
const setPopularMedia = async (
  req,
  res,
  mediaCollectionType, // "TOP_POPULAR_MOVIES" или "TOP_POPULAR_SERIES"
  popularModel, // modelPopularMovie или modelPopularSeries
  mediaTypeLabel // "фильм" или "сериал"
) => {
  const popularMedias = await swaggerAPI.mediaCollections({
    type: mediaCollectionType,
    page: 1,
  });

  const addedMedias = [];
  const errors = [];

  // Обработка каждого элемента
  await Promise.all(
    popularMedias.items.slice(0, 10).map(async (item) => {
      // Обрабатываем только первые 10 элементов
      if (item.nameRu == null) return;

      try {
        let result = await modelMediaCreate(item);
        if (result && result.error) {
          if (!result.error.includes("Такое медиа уже существует!")) {
            errors.push(result.error);
          } else {
            const existingMedia = await modelMedia.findOne({
              where: { id_media: item.kinopoiskId },
            });
            if (existingMedia) {
              result = existingMedia;
              console.log(
                "Медиа уже существует, поэтому используется текущая запись"
              );
            }
          }
        }
        if (result && !result.error) {
          console.log("Популярное медиа добавлено!");
          addedMedias.push(result);
        } else {
          console.log("Медиа не был добавлен");
        }
      } catch (error) {
        errors.push(`Ошибка: ${error}`);
      }
    })
  );

  try {
    // Получение текущих популярных медиа
    const currentPopular = await popularModel.findAll();
    const currentIds = currentPopular.map((media) => media.id_media);

    // Берутся первые 10 id из популярных фильмов для добавления
    const newIds = addedMedias.map((media) => media.id_media).slice(0, 10);

    // Остаются только те записи, которые есть в новом списке
    const idsToKeep = currentIds.filter((id) => newIds.includes(id));
    // Определяются id, которых ещё нет в текущих записях
    const idsToUpdate = newIds.filter((id) => !idsToKeep.includes(id));
    // id, которых нет в текущих, но их нужно добавить
    const idsToAdd = newIds.filter((id) => !currentIds.includes(id));

    popularModel.findAll().then( async(medias) => {
      if (medias.length === 0) {
        console.log("Таблица пустая. Нужно заполнить.")
        await Promise.all(
          idsToAdd.map(async (id) => {
            await popularModel.create({ id_media: id });
            console.log(`Фильм с id ${id} добавлен в PopularMovie`);
          })
        );
      } 
      else{
        await Promise.all(
          currentPopular.map(async (media, index) => {
            if (index < idsToUpdate.length) {
              const newId = idsToUpdate[index];
              await media.update({ id_media: newId });
              console.log(`Медиа с id ${media.id_media} обновлен на ${newId}`);
            }
          })
        );
      }
    });

    if (addedMedias.length == 0) {
      console.log("Ошибки:", errors);
      responseHandler.error(res, "Медиа не добавлены!");
    } else {
      responseHandler.goodrequest(res, {
        message: `Обновлено ${idsToUpdate.length} ${mediaTypeLabel}ов`,
        ids: idsToUpdate,
      });
    }
  } catch (error) {
    console.error(`Ошибка обновления ${mediaTypeLabel}ов:`, error);
    errors.push(`Ошибка обновления ${mediaTypeLabel}ов:`);
  }
};

// // Отдельные обработчики для роутов
// exports.setPopularMovie = (req, res) => {
//   setPopularMedia(
//     req,
//     res,
//     "TOP_POPULAR_MOVIES",
//     db.modelPopularMovie,
//     "FILM"
//   );
// };

// exports.setPopularSeries = (req, res) => {
//   setPopularMedia(
//     req,
//     res,
//     "POPULAR_SERIES",
//     db.modelPopularSeries,
//     "TV_SERIES"
//   );
// };

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
    const mediaType = req.query.mediaType || "TV_SERIES";
    const medias = await modelMedia.findAll({
      where: { mediaType: mediaType }, //Поиск по mediaType
    });
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
    console.log("getInfo");
    const id_media = req.params.id_media;
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
  getAllMedias,
  addMedia,
  getGenres,
  getMediasByType,
  getInfo,
  setPopularMedia,
  search,
  setPopularMovie: (req, res) => {
    setPopularMedia(req, res, "TOP_POPULAR_MOVIES", modelPopularMovie, "FILM");
  },
  setPopularSeries: (req, res) => {
    setPopularMedia(
      req,
      res,
      "POPULAR_SERIES",
      modelPopularSeries,
      "TV_SERIES"
    );
  },
};
//curl -X GET http://localhost:8000/api/medias?page=1&limit=10
//curl -X GET http://localhost:8000/medias?page=1&limit=10
//curl -X POST http://localhost:8000/medias -H "Content-Type: application/json" -d '{"page": 1}'
//curl -X POST http://localhost:8000/medias/genres -H "Content-Type: application/json" -d '{"mediaType": 'FILM'}'
//curl -X POST "http://localhost:8000/genres" -H "Content-Type: application/json" -d '{"mediaType": "FILM"}'
