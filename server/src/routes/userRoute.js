const express = require('express');
const userController = require('../controllers/userController');
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
  
 module.exports = {router};