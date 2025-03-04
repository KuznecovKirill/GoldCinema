const express = require('express');
const mediaController = require('../controllers/mediaController');

const router = express.Router();

router.post("/medias", mediaController.getMedias); //для получения списка медиа

router.post("/genres", mediaController.getGenres); //для получения жанров

router.post("/medias/:mediaType", mediaController.getMediasByType); //для получения типа медиа

router.get("/info/:id_media", mediaController.getInfo); //для получения подробной информации

router.get("/search", mediaController.search); //для поиска



module.exports = router;