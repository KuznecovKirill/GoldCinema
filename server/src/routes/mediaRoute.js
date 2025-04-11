const express = require("express");
const mediaController = require("../controllers/mediaController");
const { modelMedia } = require("../models/modelMedia");
const similarController = require("../controllers/similarController");
const requestHandler = require('../handlers/request.handler');
const {body} = require('express-validator');
const { modelSimilar } = require("../models/modelSimilar");
const router = express.Router();

//router.get("/medias", mediaController.getMedias); //для получения списка медиа по типу

router.get("/allMedias", mediaController.getAllMedias); // для получения списка всех медиа
router.get("/genres", mediaController.getGenres); //для получения жанров

router.post(
  "/addMedia",
  body("id_media")
    .exists()
    .withMessage("Имя пользователя")
    .custom(async (value) => {
      const media = await modelMedia.findOne({ where: { id_media: value } });
      if (media) return Promise.reject(new Error("Такое медиа уже есть!"));
    }),
    requestHandler.validate,
    mediaController.addMedia
); //Добавление медиа
router.get("/popularMovies", mediaController.setPopularMovie);
router.get("/popularSeries", mediaController.setPopularSeries);



router.get("/Type", mediaController.getMediasByType); //для получения типа медиа


router.post(
  "/similar",
  body("id_media")
    .exists()
    .withMessage("ID Медиа")
    .custom(async (value) => {
      const media = await modelSimilar.findOne({ where: { id_origin: value } });
      if (media) return Promise.reject(new Error("Для этого медиа similars определены!"));
    }),
    requestHandler.validate,
    similarController.setSimilarMedia
); //Добавление похожих медиа
router.get("/info/:id_media", mediaController.getInfo); //для получения подробной информации

router.post("/search/:mediaType",
  body("query")
  .exists(),
  body("page")
  .exists(),
  requestHandler.validate,
  mediaController.search
);
//router.get("/search/:mediaType", mediaController.search); //для поиска
router.get("/:mediaType/:mediaCategory", mediaController.getMedias); //для получения списка медиа по типу
//curl GET "http://localhost:8000/medias/FILM/all?&page=1&limit=40"
//curl GET "http://localhost:8000/medias/FILM/popular?&page=1&limit=40"
module.exports = router;
