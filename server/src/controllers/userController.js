const { modelUser } = require("../models/modelUser");
const jsonwebtoken = require("jsonwebtoken");
const responseHandler = require("../handlers/response.handler.js");
const sequelize = require("../models/database").sequelize;
const crypto = require('crypto');

//Регистрация
const signUp = async (req, res) => {
  try {
    const { us, pass } = req.body;
    console.log(us);
    const checkUser = await modelUser.findOne({ where: {username: us} }); //поиск пользователя с таким именем
    //curl -X POST -H "Content-Type: application/json" -d '{"us": "newuser", "pass": "password123"}' http://localhost:8000/signUp

    if (checkUser) return responseHandler.badrequest(res, "Такой пользователь уже зарегестрирован");
    const user = await modelUser.create({
      username: us,
      password: pass,
      passToken: crypto.randomBytes(16).toString("hex")
    });
    sequelize.sync();
    console.log(us);

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
    const { us, pass } = req.body;

    const user = await modelUser.findOne({ where: {username: us} }).select("id_user username password passToken");

    if (!user) return responseHandler.badrequest(res, "Такого пользователя не существует!"); //Проверка пользователя

    if (!user.validPassword(pass)) return responseHandler.badrequest(res, "Неверный пароль");

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
module.exports = { signUp };
