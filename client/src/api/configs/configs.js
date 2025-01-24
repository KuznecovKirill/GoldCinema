import { modelMedia } from "../../../../server/src/models/modelMedia";

const mediaType = {
    FILM: "FILM",
    tv: "TV_SERIES",
    TV_SHOW: "TV_SHOW",
    MINI_SERIES: "MINI_SERIES"
  };
  
  const mediaCategory = {
    popular: "popular",
    top_rated: "rated",
    similars: "similars"
  };

  const getMedia = async (type) => {
    try {
      const mediaItems = await modelMedia.findAll({
        where: {
          mediaType: type
        }
      });
      return mediaItems.map(media => ({
        ...media.toObject(),
        backdrop: backdropPath(media.poster), 
        poster: posterPath(media.poster)
      }));
    } catch (error) {
      console.error("Ошибка при получении медиа:", error);
      throw error;
    }
  };
  const backdropPath = (imgEndpoint) => imgEndpoint;
  const posterPath = (imgEndpoint) => imgEndpoint;
  const configs = {
    mediaType,
    mediaCategory,
    getMedia
  };
  
  export default configs;