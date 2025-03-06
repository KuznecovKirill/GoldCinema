

const mediaType = {
    FILM: "FILM",
    TV: "TV_SERIES",
    TV_SHOW: "TV_SHOW",
    MINI_SERIES: "MINI_SERIES"
  };
  
  const mediaCategory = {
    popular: "popular",
    top_rated: "rated",
    similars: "similars",
    search: "search"
  };

  // const getMedia = async (type) => {
  //   try {
  //     const mediaItems = await modelMedia.findAll({
  //       where: {
  //         mediaType: type
  //       }
  //     });
  //     return mediaItems.map(media => ({
  //       ...media.toObject(),
  //       backdrop: backdropPath(media.poster), 
  //       poster: posterPath(media.poster)
  //     }));
  //   } catch (error) {
  //     console.error("Ошибка при получении медиа:", error);
  //     throw error;
  //   }
  // };
  const backdropPath = (media_id) => `https://kinopoiskapiunofficial.tech/images/posters/kp_small/${media_id}.jpg`;
  const posterPath = (media_id) => `https://kinopoiskapiunofficial.tech/images/posters/kp_small/${media_id}.jpg`;
  const configs = {
    mediaType,
    mediaCategory,
    backdropPath,
    posterPath
  };
  
  export default configs;