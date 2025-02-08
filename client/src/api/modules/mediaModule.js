import privateClient from "../client/private.client";
import publicClient from "../client/public.client";

const mediaEndpoints = {
  medias: ({ mediaType, mediaCategory, page }) => `/medias/${mediaType}/${mediaCategory}?page=${page}`,
  info: ({id_media}) => `/info/${id_media}`,
  search: ({ mediaType, query, page }) => `${mediaType}/search?query=${query}&page=${page}`
};

const mediaModule = {
  getMedias: async ({ mediaType, mediaCategory, page }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.medias({ mediaType, mediaCategory, page })
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