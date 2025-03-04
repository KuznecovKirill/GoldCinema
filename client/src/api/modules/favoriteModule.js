import privateClient from "../client/privateClient";

const favoriteEndpoints = {
    list: "user/favorites",
    add: "user/favorites",
    remove: ({ favoriteId }) => `user/favorites/${favoriteId}`
  };
  
  const favoriteModule = {
    getList: async () => {
      try {
        const response = await privateClient.get(favoriteEndpoints.list);
  
        return { response };
      } catch (err) { return { err }; }
    },
    add: async ({
        id_user,
        id_media,
    }) => {
      try {
        const response = await privateClient.post(
          favoriteEndpoints.add,
          {
            id_user,
            id_media
          }
        );
  
        return { response };
      } catch (err) { return { err }; }
    },
    remove: async ({ favoriteId }) => {
      try {
        const response = await privateClient.delete(favoriteEndpoints.remove({ favoriteId }));
  
        return { response };
      } catch (err) { return { err }; }
    }
  };
  
  export default favoriteModule;