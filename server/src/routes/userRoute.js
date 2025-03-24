const express = require('express');
const {body} = require('express-validator');
const userController = require('../controllers/userController');
const favoriteController = require('../controllers/favoriteController');
const { modelUser } = require('../models/modelUser');
const requestHandler = require('../handlers/request.handler');
const tokenMiddleware  = require('../middlewares/middleware');
const router = express.Router();

router.post( //curl -X POST -H "Content-Type: application/json" -d '{"username": "новичок1", "password": "password123", "confirmPassword": "password123", "role": "Администратор"}' http://localhost:8000/user/signUp
    "/signUp",
    body("username") //Имя пользователя
      .exists().withMessage("Имя пользователя")
      .custom(async value => {
        const user = await modelUser.findOne({ where: { username: value } });
        if (user) return Promise.reject(new Error("Такое имя пользователя уже есть"));
      }),
    body("password") // Пароль
      .exists().withMessage("Пароль")
      .isLength({ min: 6 }).withMessage("Пароль должен состоять минимум из 6 символов"),
    body("confirmPassword")
      .exists().withMessage("Подтверждение пароля")
      .isLength({ min: 6 }).withMessage("Пароль должен состоять минимум из 6 символов")
      .custom((value, { req }) => {
        if (value !== req.body.password) throw new Error("Пароль не совпадает");
        return true;
      }),
    body("role") // Роль
      .exists().withMessage("Роль")
      .isIn(["Пользователь", "Администратор"]).withMessage("Допустимы только роли 'Пользователь' или 'Администратор'"),
    requestHandler.validate,
    userController.signUp
  );
  router.post( //curl -X POST -H "Content-Type: application/json" -d '{"username": "kirill", "password": "password123"}' http://localhost:8000/user/signIn
    "/signIn",
    body("username")
      .exists().withMessage("Имя пользователя"),
    body("password")
      .exists().withMessage("Пароль")
      .isLength({ min: 6 }).withMessage("Пароль должен состоять минимум из 6 символов"),
    requestHandler.validate,
    userController.signIn
  );

  router.put(
    "/update-password",
    tokenMiddleware.user,
    body("password")
      .exists().withMessage("Пароль")
      .isLength({ min: 6 }).withMessage("Пароль должен состоять минимум из 6 символов"),
    body("newPassword")
      .exists().withMessage("Новый пароль")
      .isLength({ min: 6 }).withMessage("Пароль должен состоять минимум из 6 символов"),
    requestHandler.validate,
    userController.updatePassword
  );

  router.get( //curl -X GET -H "Content-Type: application/json" -H 'Authorization: Bearer токен' http://localhost:8000/user/info
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
    body("id_media")
      .exists().withMessage("Требуется id медиа")
      .isLength({ min: 1 }).withMessage("ID не может быть пустым"),
    requestHandler.validate,
    favoriteController.addFavorite
  );
  router.delete(
    "/favorites/:id_favorite",
    tokenMiddleware.user,
    favoriteController.removeFavorite
  );
 module.exports = router;