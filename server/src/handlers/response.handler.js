//Файл для обработки ответов сервера

const response = (res, code, data) => res.status(code).json(data);

const badrequest = (res) => response(res, 400, {
    status: 400,
    message: "Неверный запрос пользователя!"
  });
const goodrequest = (res, data) => responseWithData(res, 200, data);
const created = (res, data) => responseWithData(res, 201, data);

export default {badrequest,goodrequest,created};