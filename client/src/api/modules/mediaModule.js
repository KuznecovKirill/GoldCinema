import privateClient from "../client/privateClient";
import publicClient from "../client/publicClient";


const mediaEndpoints = {
  medias: ({ mediaType, page, limit }) => `/medias/medias?mediaType=${mediaType}&page=${page}&limit=${limit}`,
  mediasByType: ({mediaType}) => `/Type?mediaType=${mediaType}`, //curl GET "http://localhost:8000/medias/Type?mediaType=TV_SERIES" 
  info: ({id_media}) => `/info/?id_media=${id_media}`,
  search: ({ mediaType, query, page }) => `${mediaType}/search?query=${query}&page=${page}`
};

const mediaModule = {
  getMedias: async ({ mediaType, page, limit }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.medias({ mediaType, page, limit })
      );
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
  search: async ({ mediaType, query, page }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.search({ mediaType, query, page })
      );
      return { response };
    } catch (err) { return { err }; }
  }
};

export default mediaModule;