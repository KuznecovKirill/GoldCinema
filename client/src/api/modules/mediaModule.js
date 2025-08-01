import privateClient from "../client/privateClient";
import publicClient from "../client/publicClient";


const mediaEndpoints = {
  allMedias: () => `/medias/allMedias`, //curl GET "http://localhost:8000/medias/allMedias" 
  medias: ({ mediaType, mediaCategory, page, limit }) => `/medias/${mediaType}/${mediaCategory}?&page=${page}&limit=${limit}`,
  mediasByType: ({mediaType}) => `/Type?mediaType=${mediaType}`, //curl GET "http://localhost:8000/medias/Type?mediaType=TV_SERIES" 
  info: ({id_media}) => `/medias/info/${id_media}`,
  search: ({ mediaType, query}) => `/medias/search/${mediaType}?&query=${query}`,
};

const mediaModule = {
  getAllMedias: async () =>{
    try {
      const response = await publicClient.get(
        mediaEndpoints.allMedias()
      );
      return { response };
    } catch (err) { return { err }; }
  },
  getMedias: async ({ mediaType, mediaCategory, page, limit }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.medias({ mediaType,mediaCategory, page, limit })
      );
      console.log(response);
      return { response };
    } catch (err) { return { err }; }
  },
  getMediasByType: async ({ mediaType }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.mediasByType({ mediaType })
      );
      return { response };
    } catch (err) { return { err }; }
  },
  getInfo: async ({ id_media }) => {
    try {
      const response = await privateClient.get(
        mediaEndpoints.info({ id_media })
      );
      return { response };
    } catch (err) { return { err }; }
  },
  search: async ({ mediaType, query }) => {
    try {
      
      const response = await publicClient.get(
        mediaEndpoints.search({mediaType, query}),
        
      );

      return { response };
    } catch (err) { return { err }; }
  }
};

export default mediaModule;