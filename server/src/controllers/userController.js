const { modelUser } = require("../models/modelUser");
const jsonwebtoken = require("jsonwebtoken");
const responseHandler = require("../handlers/response.handler.js");
const sequelize = require("../models/database").sequelize;
const crypto = require('crypto');

//Регистрация
const signUp = async (req, res) => {
  try {
    const { us, pass } = req.body;
    const checkUser = await modelUser.findOne({ where: { username: "newuser" } }); //поиск пользователя с таким именем

    //curl -X POST -H "Content-Type: application/json" -d '{"us": "newuser", "pass": "password123"}' http://localhost:8000/signUp

    if (checkUser) return responseHandler.badrequest(res, "Такой пользователь уже зарегестрирован");
    const user = await modelUser.create({
      username: us,
      password: pass, // Предполагается, что метод setPassword будет обрабатывать хеширование пароля
      salt: crypto.randomBytes(16).toString("hex")
    });
    sequelize.sync();
    console.log(us);

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    responseHandler.created(res, {
      token,
      ...user.dataValues,
      id: user.id,
    });
  } catch (err) {
    console.log(err);
    responseHandler.error(res);
  }
};
module.exports = { signUp };
