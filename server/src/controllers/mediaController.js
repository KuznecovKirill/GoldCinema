const { modelReview } = require("../models/modelReview.js");
const { modelUser } = require("../models/modelUser");
const { modelMedia } = require("../models/modelMedia.js");
const { modelPopularMovie } = require("../models/modelPopularMovie");
const { modelPopularSeries } = require("../models/modelPopularSeries");
const { modelFavorite } = require("../models/modelFavorite");
const responseHandler = require("../handlers/response.handler.js");
const sequelize = require("../models/database").sequelize;
const tokenMiddleware = require("../middlewares/middleware.js");
const similarController = require("../controllers/similarController.js");
const keywordController = require("../controllers/keywordController.js");
const imageController = require("../controllers/imageController.js");
const { where } = require("sequelize");
const { Op } = require("sequelize");
const { swaggerAPI } = require("../swagger/swagger.api");
const { modelImage } = require("../models/modelImage.js");
const { modelSimilar } = require("../models/modelSimilar.js");
const { modelKeyWord } = require("../models/modelKeyWord.js");
const { modelGenre } = require("../models/modelGenre");
const { modelMedia_Genre } = require("../models/modelMedia_Genre");
const { query } = require("express-validator");
const { processMediaImages } = require("./imageAnalysisController.js");
//Для добавления медиа
const modelMediaCreate = async (newMedia) => {
  try {
    const result = await modelMedia.create({
      id_media: newMedia.kinopoiskId,
      title: newMedia.nameRu,
      mediaType: newMedia.type,
      country: newMedia.countries.map((c) => c.country).join(", "), //список фильмов
      year: newMedia.year,
      genre: newMedia.genres.map((g) => g.genre).join(", "), //список жанров
      running_time: newMedia.filmLength,
      rars: newMedia.ratingAgeLimits
        ? `${newMedia.ratingAgeLimits.replace(/\D/g, "")}+`
        : null, //удаление всех нечисловых символов и добавление плюса на конце
      rating: newMedia.ratingImdb || null,
      descrition: newMedia.description || null,
      cover: newMedia.coverUrl || newMedia.posterUrl,
    });
    addGenres(result.id_media, newMedia.genres);
    sequelize.sync();

    return result;
  } catch (error) {
    if (error.name == "SequelizeUniqueConstraintError") {
      return { error: "Такое медиа уже существует!" };
    } else {
      console.error("Ошибка при создании медиа:", error);
      return { error: "Ошибка при создании медиа" }; // Возвращаем null в случае других ошибок
    }
  }
};

//Добавить жанры
const addGenres = async (id_media, genres) => {
  for (const genreName of genres.map((g) => g.genre)) {
    // Проверка существования жанра
    const genre = await modelGenre.findOne({
      where: { name_genre: genreName },
    });
    if (!genre) {
      // Создание жанра, если его нет
      await modelGenre.create({ name_genre: genreName });
      // Получение только что созданного жанра
      const newGenre = await modelGenre.findOne({
        where: { name_genre: genreName },
      });
      // Добавление связи между медиа и жанром
      await modelMedia_Genre.create({
        id_media: id_media,
        id_genre: newGenre.id_genre,
      });
    } else {
      // Добавление связи между медиа и существующим жанром
      await modelMedia_Genre.create({
        id_media: id_media,
        id_genre: genre.id_genre,
      });
    }
  }
  sequelize.sync();
};
const processMediasWithGenres = async (medias) => {
  try {
    // Обработка жанров для каждого медиа
    medias.forEach((media) => {
      if (media.Genres) {
        const genresString = media.Genres.map((genre) => genre.name_genre).join(
          ", "
        );
        media.dataValues.genres = genresString;
      }
    });

    return medias;
  } catch (error) {
    console.error("Ошибка при обработке жанров:", error);
    throw error; // Пробрасываем ошибку для обработки выше
  }
};
//Получение списка медиа
const getMedias = async (req, res) => {
  try {
    const mediaType = req.params.mediaType;
    const mediaCategory = req.params.mediaCategory;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let baseQuery = {
      limit,
      offset,
      include: [
        {
          model: modelGenre,
          as: "Genres",
          attributes: ["name_genre"],
        },
      ],
    };

    // Если категория обработки == top
    if (mediaCategory === "top") {
      const { count, rows } = await modelMedia.findAndCountAll({
        ...baseQuery,
        where: { mediaType },
        order: [["rating", "DESC"]],
      });

      const processedMedias = await processMediasWithGenres(rows);
      if (mediaType === "FILM")
        setTopMedia(req, res, "TOP_250_MOVIES", mediaType, page);
      else setTopMedia(req, res, "TOP_250_SHOWS", mediaType, page);
      return responseHandler.goodrequest(res, {
        total: count,
        page,
        limit,
        medias: processedMedias,
        mediaType,
      });
    }

    // Если категория обработки == popular
    if (mediaCategory === "popular") {
      const popularModel =
        mediaType === "FILM" ? modelPopularMovie : modelPopularSeries;

      const popularIds = await popularModel.findAll({
        attributes: ["id_media"],
      });

      const idList = popularIds.map((item) => item.id_media);

      const { count, rows } = await modelMedia.findAndCountAll({
        ...baseQuery,
        where: {
          id_media: idList,
          mediaType,
        },
        order: [["id_media", "DESC"]],
      });

      const processedMedias = await processMediasWithGenres(rows);
      return responseHandler.goodrequest(res, {
        total: count,
        page,
        limit,
        medias: processedMedias,
        mediaType,
      });
    }

    // Дефолтная обработка (без popular или top)
    const { count, rows } = await modelMedia.findAndCountAll({
      ...baseQuery,
      where: { mediaType },
      order: [["id_media", "DESC"]],
    });

    const processedMedias = await processMediasWithGenres(rows);
    return responseHandler.goodrequest(res, {
      total: count,
      page,
      limit,
      medias: processedMedias,
      mediaType,
    });
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

//Получить все медиа
const getAllMedias = async (req, res) => {
  try {
    const medias = await modelMedia.findAll({
      include: [
        {
          model: modelGenre,
          as: "Genres",
          attributes: ["name_genre"],
        },
      ],
    });

    const processedMedias = await processMediasWithGenres(medias);

    responseHandler.goodrequest(res, processedMedias);
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

//Добавление медиа по id
const addMedia = async (req, res) => {
  try {
    const { id_media } = req.body;
    const newMedia = await swaggerAPI.mediaByID({ id: id_media });
    const result = await modelMediaCreate(newMedia);
    await keywordController.addInfo(id_media);

    return responseHandler.goodrequest(res, result);
  } catch (error) {
    console.error("Ошибка в addMedia:", error);
    return responseHandler.error(res, error);
  }
};
const checkMediaExists = async (id_media) => {
  try {
    const media = await modelMedia.findOne({
      where: { id_media },
    });
    return !!media; // true, если медиа существует
  } catch (error) {
    console.error("Ошибка при проверке медиа:", error);
    return false;
  }
};

const setPopularMedia = async (
  req,
  res,
  mediaCollectionType, // "TOP_POPULAR_MOVIES" или "TOP_POPULAR_SERIES"
  popularModel, // modelPopularMovie или modelPopularSeries
  mediaTypeLabel // "фильм" или "сериал"
) => {
  try {
    const popularMedias = await swaggerAPI.mediaCollections({
      type: mediaCollectionType,
      page: req.query.page || 1,
    });

    const addedMedias = [];
    const errors = [];

    // Добавляем только первые 10 фильмов
    await Promise.all(
      popularMedias.items.slice(0, 10).map(async (item) => {
        if (item.nameRu == null) return;
        try {
          let result = await modelMediaCreate(item);
          if (result?.error) {
            if (!result.error.includes("Такое медиа уже существует!")) {
              errors.push(result.error);
            } else {
              const existingMedia = await modelMedia.findOne({
                where: { id_media: item.kinopoiskId },
              });
              if (existingMedia) {
                result = existingMedia;
              }
            }
          }
          if (result && !result.error) {
            addedMedias.push(result);
          }
        } catch (error) {
          errors.push(`Ошибка: ${error}`);
        }
      })
    );

    // Удаляем все старые популярные фильмы
    await popularModel.destroy({ where: {} });

    // Добавляем ровно 10 новых популярных фильмов
    await Promise.all(
      addedMedias.slice(0, 10).map(async (media) => {
        await popularModel.create({ id_media: media.id_media });
      })
    );

    responseHandler.goodrequest(res, {
      message: `Обновлено ${addedMedias.length} ${mediaTypeLabel}ов`,
      ids: addedMedias.map((media) => media.id_media).slice(0, 10),
    });
  } catch (error) {
    console.error(`Ошибка обновления ${mediaTypeLabel}ов:`, error);
    responseHandler.error(res, `Ошибка обновления ${mediaTypeLabel}ов`);
  }
};

const setTopMedia = async (req, res, mediaCollectionType, mediaType, page) => {
  try {
    const medias = await swaggerAPI.mediaCollections({
      type: mediaCollectionType,
      page: page,
    });
    // !medias || !medias.items
    if (!medias?.items) {
      return responseHandler.badrequest(
        res,
        "Не удалось получить медиа из API"
      );
    }
    const addedMedias = [];
    const errors = [];
    let counter = 0;
    await Promise.all(
      medias.items.slice(0, 10).map(async (media) => {
        const existingMedia = await modelMedia.findOne({
          where: { id_media: media.kinopoiskId },
        });

        if (!existingMedia) {
          try {
            await modelMediaCreate(media);
            addedMedias.push(media.kinopoiskId);
            counter++;
          } catch (error) {
            errors.push({ id_media: media.kinopoiskId, error: error.message });
          }
        } else {
          console.log(`Медиа с id ${media.kinopoiskId} уже существует.`);
        }
      })
    );

    const result = {
      added: addedMedias,
      errors: errors,
    };
    console.log(result);
    //responseHandler.goodrequest(res, result);
  } catch (error) {
    console.error(error);
    //responseHandler.error(res);
  }
};

//Получение жанров медиа
const getGenres = async (req, res) => {
  try {
    const mediaType = req.query.mediaType || "TV_SERIES";

    const medias = await modelMedia.findAll({
      where: { mediaType },
      include: [
        {
          model: modelGenre,
          as: "Genres", // Используем алиас из ассоциации
          attributes: ["name_genre"], // Выбираем только название жанра
        },
      ],
    });

    const genresSet = new Set();

    medias.forEach((media) => {
      media.Genres.forEach((genre) => genresSet.add(genre.name_genre));
    });

    const genres = Array.from(genresSet);

    if (genres.length === 0) {
      return responseHandler.notfound(res);
    }

    return responseHandler.goodrequest(res, genres);
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

//Получение информации о проекте
const getInfo = async (req, res) => {
  try {
    const id_media = req.params.id_media;
    const media = await modelMedia.findByPk(id_media);

    // Получение жанров медиа через Media_Genre
    const genres = await modelMedia_Genre.findAll({
      where: { id_media },
      include: [
        {
          model: modelGenre,
          as: "genre", // Используем алиас из ассоциации
          attributes: ["name_genre"], // Выбираем только название жанра
        },
      ],
    });
    // Извлечение названий жанров
    const mediaGenres = genres.map((mg) => mg.genre.name_genre).join(", ");
    if (mediaGenres) {
      media.dataValues.genres = mediaGenres;
    }

    console.log(media);
    // Добавление жанров к медиа

    let images = [];
    const existImage = await modelImage.findOne({
      where: { id_media },
    });

    if (!existImage) {
      console.log("Картинок нет!");
      await imageController.getImages(id_media);
    }
    images = await modelImage.findAll({
      where: { id_media },
      order: [["id_image", "DESC"]],
    });

    //Обработка изображений
    processMediaImages(id_media).catch((err) => {
      console.error("Ошибка фоновй обработки изображений:", err);
    });

    const existSimilars = await modelSimilar.findOne({
      where: { id_origin: id_media },
    });
    if (!existSimilars) {
      await similarController.setSimilarMedia(id_media); // Добавление похожих медиа
    }
    const similars = await similarController.getSimilarMedia(id_media);

    const keywords = await modelKeyWord.findOne({
      where: { id_media },
    });
    if (!keywords) keywordController.addInfo(id_media);

    const tokenDecoded = tokenMiddleware.decode(req);
    let user = null;
    let isFavorite = false;
    if (tokenDecoded) {
      user = await modelUser.findByPk(tokenDecoded.data);

      if (user) {
        const isFav = await modelFavorite.findOne({
          where: {
            id_user: user.id_user,
            id_media: parseInt(id_media),
          },
        });
        isFavorite = isFav !== null;
      }
    }

    const reviews = await modelReview.findAll({
      where: { id_media },
      include: [
        {
          model: modelUser,
          as: "user",
          attributes: ["id_user", "username"],
        },
      ],
      order: [["id_review", "DESC"]],
    });
    responseHandler.goodrequest(res, {
      media,
      reviews,
      // user,
      isFavorite,
      images,
      similars,
    });
  } catch (error) {
    console.log(error);
    responseHandler.error(res);
  }
};

// Функция для поиска медиа
// curl -X POST "http://localhost:8000/medias/search/FILM" -H "Content-Type: application/json" -d '{"query": "film Анора", "page": 1}'
const search = async (req, res) => {
  try {
    console.log("Search работает");
    const { mediaType } = req.params;
    const { query } = req.query;

    let medias;
    if (mediaType !== "ALL") {
      medias = await modelMedia.findAll({
        where: { mediaType: mediaType },
      });
    } else {
      medias = await modelMedia.findAll();
    }

    const idForSearch = medias.map((item) => item.id_media);

    const searchResult = await keywordController.search(query, idForSearch);
    const scoreMap = searchResult.reduce((acc, item) => {
      acc[item.id_media] = item.score;
      return acc;
    }, {});
    const mediaIds = searchResult.map((item) => item.id_media); //Извлечение id из списка результата
    const mediaList = await modelMedia.findAll({
      where: {
        id_media: {
          [Op.in]: mediaIds,
        },
      },
    });
    const mediaListWithScore = mediaList.map((media) => {
      const mediaJSON = media.toJSON(); // Преобразуем объект Sequelize в обычный JSON
      return {
        ...mediaJSON,
        score: scoreMap[media.id_media] || 0, // Добавляем score, если он есть, иначе 0
      };
    });
    mediaListWithScore.sort((a, b) => b.score - a.score);
    responseHandler.goodrequest(res, mediaListWithScore);
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

module.exports = {
  getMedias,
  getAllMedias,
  addMedia,
  checkMediaExists,
  getGenres,
  getInfo,
  setPopularMedia,
  search,
  setPopularMovie: (req, res) => {
    setPopularMedia(req, res, "TOP_POPULAR_MOVIES", modelPopularMovie, "FILM");
  },
  setPopularSeries: (req, res) => {
    setPopularMedia(
      req,
      res,
      "POPULAR_SERIES",
      modelPopularSeries,
      "TV_SERIES"
    );
  },
  setTopMovie: (req, res) => {
    setTopMedia(req, res, "TOP_250_MOVIES", "FILM", 1);
  },
  setTopSeries: (req, res) => {
    setTopMedia(req, res, "TOP_250_TV_SHOWS", "TV_SERIES", 1);
  },
};
