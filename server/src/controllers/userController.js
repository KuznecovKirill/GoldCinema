const { modelUser } = require("../models/modelUser");
const jsonwebtoken = require("jsonwebtoken");
const responseHandler = require("../handlers/response.handler.js");
const sequelize = require("../models/database").sequelize;
const crypto = require('crypto');

//Регистрация
const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username);
    const checkUser = await modelUser.findOne({ where: {username: username} }); //поиск пользователя с таким именем
    //curl -X POST -H "Content-Type: application/json" -d '{"us": "newuser", "pass": "password123"}' http://localhost:8000/signUp

    if (checkUser) return responseHandler.badrequest(res, "Такой пользователь уже зарегестрирован");
    const user = await modelUser.create({
      username: username,
      password: password,
      passToken: crypto.randomBytes(16).toString("hex")
    });
    sequelize.sync();
    console.log(username);

    const token = jsonwebtoken.sign(
      { data: user.id_user },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    //Отправка успешного ответа
    responseHandler.created(res, {
      token,
      ...user.dataValues,
      id: user.id_user,
    });
  } catch (err) {
    // console.log(err);
    responseHandler.error(res);
  }
};
//Вход
const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await modelUser.findOne({ where: {username: username} }).select("id_user username password passToken");

    if (!user) return responseHandler.badrequest(res, "Такого пользователя не существует!"); //Проверка пользователя

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Неверный пароль!");

    const token = jsonwebtoken.sign(
      { data: user.id_user },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.passToken = undefined;

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id_user
    });
  } catch {
    responseHandler.error(res);
  }
};
//Изменение пароля
const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel.findById(req.user.id_user).select("id_user password passToken");

    if (!user) return responseHandler.notAuthorized(res);

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Неверный пароль!");

    user.setPassword(newPassword); //установка нового пароля

    await user.save();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};
module.exports = { signUp, signIn, updatePassword };
