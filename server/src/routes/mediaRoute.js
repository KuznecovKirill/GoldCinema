const express = require('express');
const mediaController = require('../controllers/mediaController');

const router = express.Router();

router.get("/medias", mediaController.getMedias); //для получения списка медиа

router.get("/genres", mediaController.getGenres); //для получения жанров

router.get("/medias/:mediaType", mediaController.getMediasByType); //для получения типа медиа

router.get("/info/:id_media", mediaController.getInfo); //для получения подробной информации

router.get("/search", mediaController.search); //для поиска



module.exports = router;