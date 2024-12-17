const config = require('./swagger.config');

const swaggerRequest = {
    mediaByID: ({version, object, id}) => config.getUrl(version, object, id)
};
module.exports = { swaggerRequest };