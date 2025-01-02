const { Sequelize } = require("sequelize");
const { modelUser } = require("../models/modelUser");
const { modelMedia } = require("../models/modelMedia.js");
const responseHandler = require("../handlers/response.handler.js");
const sequelize = require("../models/database").sequelize;
const { swaggerAPI } = require("../swagger/swagger.api");
const tokenMiddleware = require("../middlewares/middleware.js");

//Получение списка медиа из API и заполнение ими БД
const getMediasFromAPI = async (req, res) => {
    const newCollection = await swaggerAPI.mediaCollections({
        type: "TOP_POPULAR_ALL",
        page: "3",
      });
      newCollection.items.forEach(async (item) => {
        if (item.nameRu !== null) {
          try {
            await modelMedia.create({
              id_media: item.kinopoiskId,
              title: item.nameRu,
              mediaType: item.type,
              country: item.countries.map((c) => c.country).join(", "),
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
  };
  //Получение списка проектов
  // const getMedias = async (res, req) => {
  //   try {
  //     const { page = 1, limit = 10 } = req.query; // Получаем номер страницы и лимит из запроса 
  //       const offset = (page - 1) * limit; // Расчет смещения
    
  //       const medias = await modelMedia.findAndCountAll({
  //         limit: parseInt(limit),
  //         offset: parseInt(offset),
  //         order: [['id_media', 'DESC']]
  //       });
  //       console.log(medias);
  //       responseHandler.goodrequest(res, {
  //         total: count,
  //         page: parseInt(page),
  //         limit: parseInt(limit),
  //         medias: rows,
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       responseHandler.error(res);
  //     }
  // };
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
        order: [['id_media', 'DESC']], // Сортировка по id_media по убыванию
      });
  
      responseHandler.goodrequest(res, {
        total: count, // Общее количество записей
        page: page,   // Текущая страница
        limit: limit, // Лимит на странице
        medias: rows, // Массив медиа-контента
      });
    } catch (error) {
      console.error(error); 
      responseHandler.error(res);
    }
  };
  module.exports = {getMedias};
  //curl -X GET http://localhost:8000/api/medias?page=1&limit=10
  //curl -X GET http://localhost:8000/medias?page=1&limit=10


  