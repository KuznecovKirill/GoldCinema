const responseHandler = require("../handlers/response.handler.js");
const { modelFavorite } = require("../models/modelFavorite.js");
const sequelize = require("../models/database").sequelize;
//Добавить медиа в избранное
//curl -X POST -H "Content-Type: application/json" -d '{"id_user": "1", "id_media": "738499"}' http://localhost:8000/favorites
const addFavorite = async (req, res) => {
  try {
    const {id_user, id_media} = req.body;
    const isFavorite = await modelFavorite.findOne({
      where: { id_user: id_user, id_media: id_media },
    });
    console.log(id_media);
    if (isFavorite) return responseHandler.goodrequest(res, isFavorite);

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

const getFavoritesOfUser = async (req, res) => {
  try {
    const favorites = await modelFavorite.findAll({
        where: { id_user: req.user.id_user },
        order: [["createdAt", "DESC"]], // Сортировка по дате создания
      });

    responseHandler.goodrequest(res, favorites);
  } catch {
    responseHandler.error(res);
  }
};

module.exports = { addFavorite, removeFavorite, getFavoritesOfUser };
