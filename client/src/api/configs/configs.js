

const mediaType = {
    FILM: "FILM",
    TV_SERIES: "TV_SERIES",
    TV_SHOW: "TV_SHOW",
    MINI_SERIES: "MINI_SERIES"
  };
  
  const mediaCategory = {
    popular: "popular",
    top_rated: "top",
    similars: "similars",
    search: "search"
  };

  const backdropPath = (media_id) => `https://kinopoiskapiunofficial.tech/images/posters/kp_small/${media_id}.jpg`;
  const posterPath = (media_id) => `https://kinopoiskapiunofficial.tech/images/posters/kp_small/${media_id}.jpg`;
  const configs = {
    mediaType,
    mediaCategory,
    backdropPath,
    posterPath
  };
  
  export default configs;