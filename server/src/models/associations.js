const { modelMedia } = require('./modelMedia');
const { modelGenre } = require('./modelGenre');
const { modelMedia_Genre } = require('./modelMedia_Genre');

module.exports = function setupAssociations() {
  modelMedia.belongsToMany(modelGenre, {
    through: modelMedia_Genre,
    foreignKey: 'id_media'
  });

  modelGenre.belongsToMany(modelMedia, {
    through: modelMedia_Genre,
    foreignKey: 'id_genre'
  });
};