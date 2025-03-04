//Файл для обработки ответов сервера

const response = (res, code, data) => res.status(code).json(data);

const goodrequest = (res, data) => response(res, 200, data);
const created = (res, data) => response(res, 201, data);
const badrequest = (res, message) => response(res, 400, {
  status: 400,
  message
});
const notauthorized = (res) => response(res, 401, {
  status: 401,
  message: "Не авторизован"
});
const notfound = (res) => response(res, 404, {
  status: 404,
  message: "Не найден"
});
const error = (res) => response(res, 500, {
  status: 500,
  message: "Ошибка 500"
});

module.exports = {badrequest,goodrequest,created,notauthorized,notfound,error};