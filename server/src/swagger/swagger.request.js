const config = require('./swagger.config');

const swaggerRequest = {
    mediaByID: ({version, object, id}) => config.getUrl(version, object, id),
    mediaCollections: ({version, object, collection, params}) => config.getUrl(version, object, collection, params)
};
module.exports = { swaggerRequest };