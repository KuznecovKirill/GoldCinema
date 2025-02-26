//Валидация входяхищ запросов на основе Express.js
const {validationResult} = require('express-validator');

//req - объект запроса, res - объект ответа, next - функция для передачи следующему middleware
const validate = (req, res, next) => {
    const errors = validationResult(req); //Получение списка ошибок валидации
  
    
    if (!errors.isEmpty()) return res.status(400).json({
      message: errors.array()[0].msg
    });
  
    next();
  };
  
module.exports = { validate };