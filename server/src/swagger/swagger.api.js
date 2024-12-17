const  axiosClient = require("../axios/axiosClient");
const {swaggerRequest} = require("./swagger.request");
// let url = swaggerRequest.mediaByID({version:'v2.2/', object: 'films/', id: '301'});
// console.log(url);
const swaggerAPI = {
    mediaByID: async ({id}) => await axiosClient.get(swaggerRequest.mediaByID({version:'v2.2/', object: 'films/', id: id})),
    mediaCollections: async(params) => await axiosClient.get(swaggerRequest.mediaCollections({version: 'v2.2/', object: 'films/', collection: 'collections?', params }))
};
module.exports = { swaggerAPI };

//axiosClient.get(swaggerRequest.mediaByID({version:'v2.2/', object: 'films/', id: id}))