const responseHandler = require("../handlers/response.handler");
const { modelMedia } = require("../models/modelMedia");
const { modelReview } = require("../models/modelReview");
const { modelUser } = require("../models/modelUser");
const keywordController  = require("./keywordController");
const sequelize = require("../models/database").sequelize;
const create = async (req, res) => {
  try {
    const { id_user, id_media, rating_user, comment_text } = req.body;

    const review = await modelReview.create({
      id_user: id_user,
      id_media: id_media,
      rating_user: rating_user,
      comment_text: comment_text,
    });
    sequelize.sync();
    keywordController.addInfo(id_media);
    responseHandler.created(res, {
      // id_review: review.id_review,
      user: req.user,
      ...review.dataValues,
    });
  } catch (error) {
    console.error("Ошибка:", error);
    responseHandler.error(res);
  }
};
const remove = async (req, res) => {
  try {
    const id_review = req.params.id_review;

    // Поиск отзыва по ID и пользователю
    const review = await modelReview.findOne({
      where: {
        id_review: id_review,
        id_user: req.user.id_user, // Проверяем, что отзыв принадлежит текущему пользователю
      },
    });

    if (!review) return responseHandler.notfound(res); // Если отзыв не найден, отправляем 404

    await review.destroy(); // Удаление отзыва

    responseHandler.goodrequest(res); // Отправка успешного ответа
  } catch (error) {
    console.error("Ошибка:", error);
    responseHandler.error(res);
  }
};
const getReviewsOfUser = async (req, res) => {
  try {
    // Получаем все отзывы пользователя, сортируя их по дате создания
    const reviews = await modelReview.findAll({
      where: {
        id_user: req.user.id_user,
      },
      include: [
        { model: modelUser, as: "user", attributes: ["id_user", "username"] },
        {
          model: modelMedia,
          as: "media",
          attributes: ["id_media", "title", "mediaType", "cover"],
        },
      ],
      order: [["id_review", "DESC"]], // Сортировка по дате создания в порядке убывания
    });
    responseHandler.goodrequest(res, reviews); // Отправляем успешный ответ с отзывами
  } catch (error) {
    console.error("Ошибка:", error);
    responseHandler.error(res);
  }
};
module.exports = { create, remove, getReviewsOfUser };
