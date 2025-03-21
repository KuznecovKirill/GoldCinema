import privateClient from "../client/privateClient";

const favoriteEndpoints = {
    list: "user/favorites",
    add: "user/favorites",
    remove: ({ id_favorite }) => `user/favorites/${id_favorite}`
  };
  
  const favoriteModule = {
    getList: async () => {
      try {
        const response = await privateClient.get(favoriteEndpoints.list);
  
        return { response };
      } catch (err) { return { err }; }
    },
    add: async ({
        id_media,
    }) => {
      try {
        const response = await privateClient.post(
          favoriteEndpoints.add,
          {
            id_media
          }
        );
  
        return { response };
      } catch (err) { return { err }; }
    },
    remove: async ({ id_favorite }) => {
      try {
        const response = await privateClient.delete(favoriteEndpoints.remove({ id_favorite }));
  
        return { response };
      } catch (err) { return { err }; }
    }
  };
  
  export default favoriteModule;