const { modelReview } = require("../models/modelReview.js");
const { modelUser } = require("../models/modelUser");
const { modelMedia } = require("../models/modelMedia.js");
const responseHandler = require("../handlers/response.handler.js");
const sequelize = require("../models/database").sequelize;
const tokenMiddleware = require("../middlewares/middleware.js");
const { modelSimilar } = require("../models/modelSimilar.js");
const { swaggerAPI } = require("../swagger/swagger.api.js");

const getSimilarMedia = async (id_media) => {
    const similarEntries = await modelSimilar.findAll({
      where: { id_origin: id_media },
      include: [{
        model: modelMedia,
        as: 'similarMedia',
        required: true // Это обеспечит получение только тех записей, которые имеют связанные медиа
      }]
    });
  
    return similarEntries.map(entry => entry.similarMedia);
  };

  module.exports = {getSimilarMedia};