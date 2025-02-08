const express = require('express');
const mediaController = require('../controllers/mediaController');

const router = express.Router();

router.post("/medias", mediaController.getMedias);

router.post("/genres", mediaController.getGenres);

router.get("/info/:id_media", mediaController.getInfo);

router.get("/search", mediaController.search);


module.exports = router;