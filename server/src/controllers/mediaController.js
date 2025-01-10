const { modelReview } = require("../models/modelReview.js");
const { modelUser } = require("../models/modelUser");
const { modelMedia } = require("../models/modelMedia.js");
const responseHandler = require("../handlers/response.handler.js");
const sequelize = require("../models/database").sequelize;
const tokenMiddleware = require("../middlewares/middleware.js");

//Получение списка проектов
const getMedias = async (req, res) => {
  try {
    // Извлекаем параметры из объекта запроса
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
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
//Получение жанров
// curl -X POST "http://localhost:8000/genres" -H "Content-Type: application/json" -d '{"mediaType": "FILM"}'
const getGenres = async (req, res) => {
  try {
    const mediaType = req.body.mediaType || "FILM";

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

    //const similar = await similarController... нкжно будет добавить контроллер simillar, чтобы получать похожие проекты
    //Тоже самое для изображений


    const tokenDecoded = tokenMiddleware.decode(req);
    let user = null;
    if (tokenDecoded) { //Проверка работы decode
      user = await modelUser.findByPk(tokenDecoded.data);

    }
    //Добавить получения отзывов о проекте
    const reviews = await modelReview.findAll({
      where: { id_media: id_media }, 
      order: [['createdAt', 'DESC']] // Сортируем отзывы по дате создания (по убыванию)
    });

    responseHandler.goodrequest(res, {
      media,
      reviews,
      user
    });
    responseHandler.goodrequest(res, media);
  } catch (error) {
    console.log(error);
    responseHandler.error(res);
  }
};
// Нужно будет добавить функцию для поиска
module.exports = { getMedias, getGenres, getInfo };
//curl -X GET http://localhost:8000/api/medias?page=1&limit=10
//curl -X GET http://localhost:8000/medias?page=1&limit=10
//curl -X POST http://localhost:8000/medias -H "Content-Type: application/json" -d '{"page": 1}'
//curl -X POST http://localhost:8000/medias/genres -H "Content-Type: application/json" -d '{"mediaType": 'FILM'}'
//curl -X POST "http://localhost:8000/genres" -H "Content-Type: application/json" -d '{"mediaType": "FILM"}'
