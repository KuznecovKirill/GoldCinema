const responseHandler = require("../handlers/response.handler");
const modelReview = require("../models/modelReview");
const  modelUser  = require("../models/modelUser");
const sequelize = require("../models/database").sequelize;
const create = async (req, res) => {
  try {
    const { user, id_media, rating, comment } = req.body;

    const review = await modelReview.create({
      id_user: user.id_user,
      id_media: id_media,
      rating_user: rating,
      comment_text: comment,
    });
    sequelize.sync();

    responseHandler.created(res, {
      id_review: review.id_review,
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
    const { id_review } = req.params;

    // Поиск отзыва по ID и пользователю
    const review = await modelReview.findOne({
      where: {
        id_review: id_review,
        id_user: req.user.id, // Проверяем, что отзыв принадлежит текущему пользователю
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
        id_user: req.user.id,
      },
      include: [{
        model: modelUser,
        as: 'user', // Указанный псевдоним
        attributes: ['id_user','username'] // Выбираем нужные поля
      }],
      order: [["id_review", "DESC"]], // Сортировка по дате создания в порядке убывания
    });

    responseHandler.goodrequest(res, reviews); // Отправляем успешный ответ с отзывами
  } catch (error) {
    console.error("Ошибка:", error);
    responseHandler.error(res);
  }
};
module.exports = { create, remove, getReviewsOfUser };
