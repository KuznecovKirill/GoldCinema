const { modelReview } = require("../models/modelReview.js");
const { modelUser } = require("../models/modelUser");
const { modelMedia } = require("../models/modelMedia.js");
const responseHandler = require("../handlers/response.handler.js");
const sequelize = require("../models/database").sequelize;
const tokenMiddleware = require("../middlewares/middleware.js");
const { modelSimilar } = require("../models/modelSimilar.js");
const { swaggerAPI } = require("../swagger/swagger.api.js");
const mediaController = require("./mediaController.js");
const axios = require("axios");
const getSimilarMedia = async (id_media) => {
  const similarEntries = await modelSimilar.findAll({
    where: { id_origin: id_media },
    attributes: ['id_media'] // Выбираем только id связанных медиа
  });
  // Получение связанных медиа
  const mediaIds = similarEntries.map(entry => entry.id_media);
  const mediaList = await modelMedia.findAll({
    where: { id_media: mediaIds }
  });
  return mediaList;

  };
const setSimilarMedia = async (id_media) => { //curl -X POST "http://localhost:8000/medias/similar" -H "Content-Type: application/json" -d '{"id_media": "258687"}'
  //const {id_media} = req.body;
  
  const similars = await swaggerAPI.mediaSimilars( { id: `${id_media}/` },
    { similars: "similars" }
  );


  const firstFiveSimilars = similars.items.slice(0, 5); //Берутся только первые 5
  for (const item of firstFiveSimilars) {
    try {
      const existingMedia = await modelMedia.findOne({ where: { id_media: item.filmId } }); //Проверка на существование similarMedia в в Media
      if (!existingMedia) {
        // Добавление медиа
        const response = await axios.post('http://localhost:8000/goldcinema/v1/medias/addMedia', {
          id_media: item.filmId
        });
        if (response.status !== 200) {
          throw new Error(`Ошибка добавления медиа ${item.filmId}`);
        }
      }
      
      await modelSimilar.create({
        id_origin: id_media,
        id_media: item.filmId,
      });
    } catch (error) {
      console.log(error);
    }
  }
  sequelize.sync();
  // responseHandler.goodrequest(res, firstFiveSimilars);
}

const setSimilarMediaByAPI = async (req, res) => { //curl -X POST "http://localhost:8000/medias/similar" -H "Content-Type: application/json" -d '{"id_media": "258687"}'
  const {id_media} = req.body;
  
  const similars = await swaggerAPI.mediaSimilars( { id: `${id_media}/` },
    { similars: "similars" }
  );


  const firstFiveSimilars = similars.items.slice(0, 5); //Берутся только первые 5
  for (const item of firstFiveSimilars) {
    try {
      const existingMedia = await modelMedia.findOne({ where: { id_media: item.filmId } }); //Проверка на существование similarMedia в в Media
      if (!existingMedia) {
        // Добавление медиа
        const response = await axios.post('http://localhost:8000/goldcinema/v1/medias/addMedia', {
          id_media: item.filmId
        });
        if (response.status !== 200) {
          throw new Error(`Ошибка добавления медиа ${item.filmId}`);
        }
      }
      
      await modelSimilar.create({
        id_origin: id_media,
        id_media: item.filmId,
      });
    } catch (error) {
      console.log(error);
    }
  }
  sequelize.sync();
  responseHandler.goodrequest(res, firstFiveSimilars);
}
  module.exports = {getSimilarMedia, setSimilarMedia, setSimilarMediaByAPI};