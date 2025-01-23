//Файл для проверки авторизированных пользователей
const jsonwebtoken = require('jsonwebtoken');
const { modelUser } = require('../models/modelUser');
const {responseHandler} = require('../handlers/response.handler');

const decode = (req) => {
    try {
      const bearerHeader = req.headers["authorization"];
  
      if (bearerHeader) {
        const token = bearerHeader.split(" ")[1];
  
        return jsonwebtoken.verify(
          token,
          process.env.TOKEN_SECRET
        );
      }
  
      return false;
    } catch {
      return false;
    }
  };
  const user = async (req, res, next) => {
    const token = decode(req);
  
    if (!token) return responseHandler.notauthorized(res);
  
    const userID = await modelUser.findByPk(tokenDecoded.data); //Извлечение id
  
    if (!userID) return responseHandler.notauthorized(res); //
  
    req.user = userID;
  
    next();
  };
module.exports = {user, decode};