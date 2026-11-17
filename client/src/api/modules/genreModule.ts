import axiosClient from "../client/axiosClient";

const genreEndpoints = {
  list: (mediaType: string) => `/medias/genres?mediaType=${mediaType}`,
};

interface GetListParams {
  mediaType: string;
}

const genreModule = {
  getList: async ({ mediaType }: GetListParams): Promise<{ response?: string[]; err?: any }> => {
    try {
      const response = await axiosClient.get<string[]>(genreEndpoints.list(mediaType));
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default genreModule;