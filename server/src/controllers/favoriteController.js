const responseHandler = require("../handlers/response.handler.js");
const { modelFavorite } = require("../models/modelFavorite.js");
const sequelize = require("../models/database").sequelize;
//Добавить медиа в избранное
//curl -X POST -H "Content-Type: application/json" -d '{"id_user": "1", "id_media": "738499"}' http://localhost:8000/favorites
const addFavorite = async (req, res) => { //curl -X POST http://localhost:8000/user/favorites -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjozOSwiaWF0IjoxNzQxMTAxNDAzLCJleHAiOjE3NDExODc4MDN9.nCbaDsorTlYh3kPr3RMs-fbOGERvhC4rNlHRgUNjbfU' -d '{"id_media": "104927"}'
  try {
    const id_user = req.user.id_user;
    const {id_media} = req.body;
    const isFavorite = await modelFavorite.findOne({
      where: { id_user: req.user.id_user, id_media: id_media },
    });
    console.log(id_media);
    if (isFavorite){ 
      console.log("Медиа уже в избранном!");
      return responseHandler.goodrequest(res, isFavorite);
    }

    const favorite = await modelFavorite.create({
      id_user: id_user,
      id_media: id_media,
    });
    sequelize.sync();
    responseHandler.created(res, favorite);
  } catch (err) {
    console.log(err);
    responseHandler.error(res);
  }
};
// Удаление из избранного
const removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.body;

    const favorite = await modelFavorite.findOne({
      where: { id_user: req.user.id_user, id_favorite: favoriteId },
    });

    if (!favorite) return responseHandler.notfound(res);

    await favorite.destroy();

    responseHandler.goodrequest(res);
  } catch (err) {
    responseHandler.error(res);
  }
};
//Получение списка избранного у пользователя
const getFavoritesOfUser = async (req, res) => {
  try {
    const favorites = await modelFavorite.findAll({
        where: { id_user: req.user.id_user },
        order: [["createdAt", "DESC"]], // Сортировка по дате создания
      });
      console.log(req.user.id_user);
    responseHandler.goodrequest(res, favorites);
  } catch {
    console.error('Ошибка при получении избранного:', error);
    responseHandler.error(res);
  }
};

module.exports = { addFavorite, removeFavorite, getFavoritesOfUser };
