const { modelMedia } = require("../models/modelMedia.js");
const { modelImage } = require("../models/modelImage.js");
const sequelize = require("../models/database").sequelize;
const { swaggerAPI } = require("../swagger/swagger.api.js");
const { processMediaImages } = require("./imageAnalysisController.js");

const getImages = async (id_media) => {
  const newImages = await swaggerAPI.mediaImages(
    { id: `${id_media}/` },
    { images: "images?", type: "STILL", page: "1" }
  );
  const firstSixImages = newImages.items.slice(0, 6); //Берутся только первые 6
  for (const item of firstSixImages) {
    try {
      await modelImage.create({
        id_media: id_media,
        imageUrl: item.imageUrl,
      });
    } catch (error) {
      if (error instanceof sequelize.UnknownConstraintError) {
        console.log("Отлов ошибки изображения!");
      }
    }

    try {
      console.log(`Начинаем анализ изображений для медиа ID: ${id_media}`);
      await processMediaImages(id_media);
      console.log(`Анализ изображений завершен для медиа ID: ${id_media}`);
    } catch (error) {
      console.error(
        `Ошибка при анализе изображений для медиа ID ${id_media}:`,
        error
      );
    }
  }
  sequelize.sync();
};

module.exports = { getImages };
