import axiosClient from "../client/axiosClient";
import { Media } from "../../types";

const mediaEndpoints = {
  allMedias: () => `/medias/allMedias`,
  medias: (mediaType: string, mediaCategory: string, page: number, limit: number) => `/medias/${mediaType}/${mediaCategory}?&page=${page}&limit=${limit}`, //curl GET "http://localhost:8000/medias/allMedias" 
  mediasByType: (mediaType: string) => `/Type?mediaType=${mediaType}`,  //curl GET "http://localhost:8000/medias/Type?mediaType=TV_SERIES" 
  info: (id_media: number) => `/medias/info/${id_media}`,
  search: (mediaType: string, query: string) => `/medias/search/${mediaType}?&query=${query}`,
};

interface GetMediasParams {
  mediaType: string;
  mediaCategory: string;
  page: number;
  limit: number;
}

interface MediaTypeParams {
  mediaType: string;
}

interface GetInfoParams {
  id_media: number;
}

interface SearchParams {
  mediaType: string;
  query: string;
}


const mediaModule = {
  getAllMedias: async (): Promise<{ response?: Media[]; err?: any }> => {
    try {
      const response = await axiosClient.get<Media[]>(mediaEndpoints.allMedias());
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getMedias: async ({ mediaType, mediaCategory, page, limit }: GetMediasParams): Promise<{ response?: any; err?: any }> => {
    try {
      const response = await axiosClient.get(
        mediaEndpoints.medias(mediaType, mediaCategory, page, limit)
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getMediasByType: async ({ mediaType }: MediaTypeParams): Promise<{ response?: Media[]; err?: any }> => {
    try {
      const response = await axiosClient.get<Media[]>(mediaEndpoints.mediasByType(mediaType));
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getInfo: async ({ id_media }: GetInfoParams): Promise<{ response?: Media; err?: any }> => {
    try {
      const response = await axiosClient.get<Media>(mediaEndpoints.info(id_media));
      return { response };
    } catch (err) {
      return { err };
    }
  },
  search: async ({ mediaType, query }: SearchParams): Promise<{ response?: Media[]; err?: any }> => {
    try {
      const response = await axiosClient.get<Media[]>(mediaEndpoints.search(mediaType, query));
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default mediaModule;