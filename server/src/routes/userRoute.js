const express = require('express');
const userController = require('../controllers/userController');
const { modelUser } = require('../models/modelUser');

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
      .isLength({ min: 8 }).withMessage("Пароль должен состоять миниму из 8 символов"),
    body("confirmPassword")
      .exists().withMessage("Подтверждение пароля")
      .isLength({ min: 8 }).withMessage("Пароль должен состоять миниму из 8 символов")
      .custom((value, { req }) => {
        if (value !== req.body.password) throw new Error("Пароль не совпадает");
        return true;
      }),
    requestHandler.validate,
    modelUser.signUp
  );
  
  export default router;