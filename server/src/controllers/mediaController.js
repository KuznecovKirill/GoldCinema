const { modelReview } = require("../models/modelReview.js");
const { modelUser } = require("../models/modelUser");
const { modelMedia } = require("../models/modelMedia.js");

const responseHandler = require("../handlers/response.handler.js");
const sequelize = require("../models/database").sequelize;
const tokenMiddleware = require("../middlewares/middleware.js");
const similarController = require("../controllers/similarController.js");
const keywordController = require("../controllers/keywordController.js");
const { where } = require("sequelize");
const { Op } = require("sequelize");

//Получение списка проектов
const getMedias = async (req, res) => { //curl GET "http://localhost:8000/medias/medias?mediaType=FILM&page=1&limit=10"
  try {
    // Извлекаем параметры из объекта запроса
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit; //Расчёт смещения

    // Запрос к базе данных
    const { count, rows } = await modelMedia.findAndCountAll({
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

//
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
  try {
    const { id_media } = req.body;

    const media = await modelMedia.findByPk(id_media);
    const similar = await similarController.getSimilarMedia(id_media);
    //const similar = await similarController... нкжно будет добавить контроллер simillar, чтобы получать похожие проекты
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
      similar, //информация о похожих проектах
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
    const mediaIds = searchResult.map(item => item.id_media); //Извлечение id из списка результата
    const mediaList = await modelMedia.findAll({
      where: {
        id_media: {
          [Op.in]: mediaIds,
        },
      },
    });
    const mediaListWithScore = mediaList.map(media => {
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

module.exports = { getMedias, getGenres, getMediasByType, getInfo, search };
//curl -X GET http://localhost:8000/api/medias?page=1&limit=10
//curl -X GET http://localhost:8000/medias?page=1&limit=10
//curl -X POST http://localhost:8000/medias -H "Content-Type: application/json" -d '{"page": 1}'
//curl -X POST http://localhost:8000/medias/genres -H "Content-Type: application/json" -d '{"mediaType": 'FILM'}'
//curl -X POST "http://localhost:8000/genres" -H "Content-Type: application/json" -d '{"mediaType": "FILM"}'
