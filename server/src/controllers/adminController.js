const responseHandler = require("../handlers/response.handler");
const mediaController = require("../controllers/mediaController");

const handleCommand = async (req, res) => {
  try {
    const { command, params } = req.body;

    switch (command) {
      case "addMedia":
        //curl -X POST "http://localhost:8000/admin/add-media" -H "Content-Type: application/json" -d '{"command": "addMedia", "params": {"id_media": "900"}}'
        req.body = { id_media: params.id_media };
        const mediaExists = await mediaController.checkMediaExists(params.id_media);
         if (mediaExists) {
          return responseHandler.badrequest(res, "Медиа с таким ID уже существует.");
        }
        await mediaController.addMedia(req, res);
        break;
      case "addMediaList":
        //curl -X POST "http://localhost:8000/admin/add-media" -H "Content-Type: application/json" -d '{"command": "addMediaList", "params": {"collection": "TOP_250_MOVIES", "page": "1"}}'
        req.params = {
          mediaType:
            params.collection === "TOP_250_MOVIES" ? "FILM" : "TV_SERIES",
          mediaCategory: "top",
        };
        req.query = { page: params.page };
        await mediaController.getMedias(req, res);
        break;
      case "updatePopular":
        req.params = {
          mediaType: params.mediaType,
          mediaCategory: "popular",
        };
        req.query = { page: params.page };
        console.log(req.params.mediaType);
        if (req.params.mediaType === "FILM")
          mediaController.setPopularMovie(req, res, "TOP_POPULAR_MOVIES", params.mediaType); //curl -X POST "http://localhost:8000/admin/add-media" -H "Content-Type: application/json" -d '{"command": "updatePopular", "params": {"collection": "TOP_POPULAR_MOVIES", "page": "1"}}'
        else
        mediaController.setPopularSeries(req, res, "POPULAR_SERIES", params.mediaType);
        break;
      default:
        return responseHandler.badrequest(res, "Неизвестная команда");
    }

    //responseHandler.goodrequest(res, { message: "Команда успешно выполнена" });
  } catch (error) {
    console.error("Ошибка при выполнении команды:", error);
    responseHandler.error(res);
  }
};

module.exports = { handleCommand };
