import axiosClient from "../client/axiosClient";
import { Favorite } from "../../types";

const favoriteEndpoints = {
  //TODO: проверить, что на бэке: /favorites или /user/favorites
  list: "user/favorites", 
  add: "user/favorites",
  remove: (id_favorite: number) => `user/favorites/${id_favorite}`,
};

interface AddFavoriteParams {
  id_media: number;
}

interface RemoveFavoriteParams {
  id_favorite: number;
}

const favoriteModule = {
  getList: async (): Promise<{ response?: Favorite[]; err?: any }> => {
    try {
      const response = await axiosClient.get<Favorite[]>(favoriteEndpoints.list);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  add: async ({ id_media }: AddFavoriteParams): Promise<{ response?: Favorite; err?: any }> => {
    try {
      const response = await axiosClient.post<Favorite>(favoriteEndpoints.add, {
        id_media,
      });
      return { response };
    } catch (err) {
      return { err };
    }
  },
  remove: async ({ id_favorite }: RemoveFavoriteParams): Promise<{ response?: any; err?: any }> => {
    try {
      const response = await axiosClient.delete(favoriteEndpoints.remove(id_favorite));
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default favoriteModule;