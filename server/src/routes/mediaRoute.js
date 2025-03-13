const express = require("express");
const mediaController = require("../controllers/mediaController");
const { modelMedia } = require("../models/modelMedia");
const requestHandler = require('../handlers/request.handler');
const {body} = require('express-validator');
const router = express.Router();

//router.get("/medias", mediaController.getMedias); //для получения списка медиа по типу
router.get("/:mediaType/:mediaCategory", mediaController.getMedias); //для получения списка медиа по типу
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

router.get("/Type", mediaController.getMediasByType); //для получения типа медиа

router.get("/info/:id_media", mediaController.getInfo); //для получения подробной информации

router.get("/search", mediaController.search); //для поиска

module.exports = router;
