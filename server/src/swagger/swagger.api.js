const  axiosClient = require("../axios/axiosClient");
const {swaggerRequest} = require("./swagger.request");

const swaggerAPI = {
    mediaByID: async ({id}) => await axiosClient.get(swaggerRequest.mediaByID({version:'v2.2/', object: 'films/', id: id})),
    mediaCollections: async(params) => await axiosClient.get(swaggerRequest.mediaCollections({version: 'v2.2/', object: 'films/', collection: 'collections?', params })),
    mediaSimilars: async ({id}) => await axiosClient.get(swaggerRequest.mediaSimilars({version:'v2.2/', object: 'films/', id: id, params}))
};
module.exports = { swaggerAPI };

//axiosClient.get(swaggerRequest.mediaByID({version:'v2.2/', object: 'films/', id: id}))
// mediaSimilars: async ({id}) => await axiosClient.get(swaggerRequest.mediaSimilar({version:'v2.2/', object: 'films/', id: id, similars: 'similars'})),