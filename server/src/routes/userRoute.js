const express = require('express');
const {body} = require('express-validator');
const userController = require('../controllers/userController');
const favoriteController = require('../controllers/favoriteController');
const { modelUser } = require('../models/modelUser');
const requestHandler = require('../handlers/request.handler');
const tokenMiddleware  = require('../middlewares/middleware');
const router = express.Router();

router.post(
    "/signUp",
    body("username") //Имя пользователя
      .exists().withMessage("Имя пользователя")
      .custom(async value => {
        const user = await modelUser.findOne({ where: { username: value } });
        if (user) return Promise.reject(new Error("Такое имя пользователя уже есть"));
      }),
    body("password") //
      .exists().withMessage("Пароль")
      .isLength({ min: 8 }).withMessage("Пароль должен состоять минимум из 8 символов"),
    body("confirmPassword")
      .exists().withMessage("Подтверждение пароля")
      .isLength({ min: 8 }).withMessage("Пароль должен состоять минимум из 8 символов")
      .custom((value, { req }) => {
        if (value !== req.body.password) throw new Error("Пароль не совпадает");
        return true;
      }),
    requestHandler.validate,
    userController.signUp
  );
  router.post(
    "/signin",
    body("username")
      .exists().withMessage("Имя пользователя"),
    body("password")
      .exists().withMessage("Пароль")
      .isLength({ min: 8 }).withMessage("Пароль должен состоять минимум из 8 символов"),
    requestHandler.validate,
    userController.signIn
  );

  router.put(
    "/update-password",
    tokenMiddleware.user,
    body("password")
      .exists().withMessage("Пароль")
      .isLength({ min: 8 }).withMessage("Пароль должен состоять минимум из 8 символов"),
    body("newPassword")
      .exists().withMessage("Новый пароль")
      .isLength({ min: 8 }).withMessage("Пароль должен состоять минимум из 8 символов"),
    requestHandler.validate,
    userController.updatePassword
  );

  router.get(
    "/info",
    tokenMiddleware.user,
    userController.getInfo
  );
  
  router.get(
    "/favorites",
    tokenMiddleware.user,
    favoriteController.getFavoritesOfUser
  );

  router.post(
    "/favorites",
    tokenMiddleware.user,
    body("mediaType")
      .exists().withMessage("Тип медиа")
      .custom(type => ["FILM", "MINI_SERIES","TV_SERIES","TV_SHOW"].includes(type)).withMessage("Ошибка типа данных"),
    body("id_media")
      .exists().withMessage("Требуется id медиа")
      .isLength({ min: 1 }).withMessage("ID не может быть пустым"),
    body("title")
      .exists().withMessage("Требуется название медиа"),
    body("poster")
      .exists().withMessage("Требуется постер медиа"),
    body("rating")
      .exists().withMessage("Требуется рейтинг"),
    requestHandler.validate,
    favoriteController.addFavorite
  );
  router.delete(
    "/favorites/:id_favorite",
    tokenMiddleware.user,
    favoriteController.removeFavorite
  );
 module.exports = router;