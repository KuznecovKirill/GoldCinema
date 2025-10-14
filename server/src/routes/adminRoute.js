const express = require('express');

const { body } = require('express-validator');
const requestHandler = require('../handlers/request.handler');
const tokenMiddleware = require('../middlewares/middleware');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post(
  "/add-media",
  tokenMiddleware.user,
  body("command")
    .exists().withMessage("Требуется команда")
    .isIn(["addMedia", "addMediaList", "updatePopular"]),
  body("params")
    .exists().withMessage("Требуются параметры"),
  requestHandler.validate,
  adminController.handleCommand
);

module.exports = router;
