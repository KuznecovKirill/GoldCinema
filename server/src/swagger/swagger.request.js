const config = require('./swagger.config');

const swaggerRequest = {
    mediaByID: ({version, object, id}) => config.getUrl(version, object, id),
    mediaCollections: ({version, object, collection, params}) => config.getUrl(version, object, collection, params),
    mediaSimilars: ({version,object,id, params}) => config.getUrl(version,object,id, params),
    mediaImage: ({version, object,id,params}) => config.getUrl(version,object,id, params)
};
module.exports = { swaggerRequest };

// mediaSimilars: ({version,object,id}) => config.getUrl(version,object,id, params)