const express = require('express');
const mediaController = require('../controllers/mediaController');

const router = express.Router({ mergeParams: true });

router.post("/medias", mediaController.getMedias);

router.post("/genres", mediaController.getGenres);

router.get("/info/:id_media", mediaController.getInfo);


module.exports = {router};