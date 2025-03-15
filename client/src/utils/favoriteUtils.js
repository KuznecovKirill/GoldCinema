const favoriteUtils = {
    check: ({ listFavorites, id_media }) => listFavorites && listFavorites.find(e => e.id_media.toString() === id_media.toString()) !== undefined
  };
export default favoriteUtils;