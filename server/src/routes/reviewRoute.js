const express = require("express");
const validator = require("express-validator");
const reviewController = require("../controllers/reviewController");
const tokenMiddleware = require("../middlewares/middleware");
const requestHandler = require("../handlers/request.handler");

const router = express.Router();

router.get("/", tokenMiddleware.user, reviewController.getReviewsOfUser);

router.post(
  "/",
  tokenMiddleware.user,
  body("id_media")
    .exists()
    .withMessage("Требуется id_media")
    .isLength({ min: 1 })
    .withMessage("mediaId не может быть пустым"),
  body("rating_user")
    .exists()
    .withMessage("Требуется рейтинг"),
  body("comment_text")
    .exists()
    .withMessage("Требуется комментарий"),
  requestHandler.validate,
  reviewController.create
);
module.exports = {router};