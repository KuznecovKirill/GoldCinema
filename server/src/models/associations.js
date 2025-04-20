const { modelMedia } = require('./modelMedia');
const { modelGenre } = require('./modelGenre');
const { modelMedia_Genre } = require('./modelMedia_Genre');
const { modelReview } = require('./modelReview');
const { modelUser } = require('./modelUser');

module.exports.setupAssociations = function () {
  modelMedia.belongsToMany(modelGenre, {
    through: modelMedia_Genre,
    foreignKey: 'id_media',
    as: 'Genres',
  });

  modelGenre.belongsToMany(modelMedia, {
    through: modelMedia_Genre,
    foreignKey: 'id_genre',
    as: 'Medias',
  });

  modelMedia_Genre.belongsTo(modelGenre, {
    foreignKey: 'id_genre',
    as: 'genre',
  });
  // Отзыв принадлежит медиа
  modelReview.belongsTo(modelMedia, {
    foreignKey: 'id_media',
    as: 'media',
  });
};
