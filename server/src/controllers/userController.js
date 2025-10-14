const { modelUser } = require("../models/modelUser");
const jsonwebtoken = require("jsonwebtoken");
const responseHandler = require("../handlers/response.handler.js");

//Регистрация
const signUp = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const checkUser = await modelUser.findOne({ where: {username: username} }); //поиск пользователя с таким именем

    //curl -X POST -H "Content-Type: application/json" -d '{"us": "newuser", "pass": "password123"}' http://localhost:8000/signUp

    if (checkUser) return responseHandler.badrequest(res, "Такой пользователь уже зарегестрирован");
    const user = new modelUser();
        user.username = username;
        await user.setPassword(password);

        if (role == "Пользователь")
          user.id_role = 1
        else
        user.id_role = 2;

    await user.save();
    const token = jsonwebtoken.sign(
      { data: user.id_user },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    
    //Отправка успешного ответа
    responseHandler.created(res, {
      token,
      ...user.dataValues,
      // id: user.id_user,
    });
  } catch {
    responseHandler.error(res);
  }
};
//Вход
//curl -X POST -H "Content-Type: application/json" -d '{"username": "kirill", "password": "password123"}' http://localhost:8000/user/signIn
const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await modelUser.findOne({ 
      where: {username: username, password: password}, 
      attributes: ['id_user', 'username', 'password', 'passToken', 'id_role'] });
    console.log(user);
    if (!user) return responseHandler.notfound(res); //Проверка пользователя

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Неверный пароль!");

    const token = jsonwebtoken.sign(
      { data: user.id_user },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    //Для безопасности убирается пароль и токен из ответа
    user.password = undefined;
    user.passToken = undefined;
    console.log("Вход успешен");
    responseHandler.created(res, {
      token,
      ...user.dataValues,
      // id: user.id_user
    });
  } catch {
    responseHandler.error(res);
  }
};
//Изменение пароля
const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = await modelUser.findByPk(req.user.id_user, {
      attributes: ['id_user', 'password', 'passToken']
    });
    if (!user) return responseHandler.notauthorized(res);

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Неверный пароль!");
    
    user.setPassword(newPassword); //установка нового пароля

    await user.save();
    responseHandler.goodrequest(res);
  } catch {
    responseHandler.error(res);
  }
};
//Получение информации о пользователе
const getInfo = async (req, res) => { 
  try {
    const user = await modelUser.findByPk(req.user.id_user);
    if (!user) return responseHandler.notfound(res);

    responseHandler.goodrequest(res, user);
  } catch {
    responseHandler.error(res);
  }
};
module.exports = { signUp, signIn, updatePassword, getInfo };

