const  axiosClient = require("../axios/axiosClient");
const {swaggerRequest} = require("./swagger.request");


// src/modules/external-api/swagger.api.service.ts
import { Injectable } from "@nestjs/common";

import { SwaggerRequest } from "./swagger.request";
import { AxiosClient } from "@/axios/axiosClient";

export interface KinopoiskImage {
  imageUrl: string;
  previewUrl: string;
}


@Injectable()
export class SwaggerApiService {
  private readonly swaggerRequest = new SwaggerRequest();

  constructor(private readonly axiosClient: AxiosClient) {}

  async mediaByID(id: number): Promise<any> {
    const url = this.swaggerRequest.mediaByID({
      version: "v2.2/",
      object: "films/",
      id,
    });
    return await this.axiosClient.get(url);
  }

  async mediaCollections(params: {
    type: string;
    page?: number;
  }): Promise<any> {
    const url = this.swaggerRequest.mediaCollections({
      version: "v2.2/",
      object: "films/",
      collection: "collections?",
      params: {
        type: params.type,
        page: params.page || 1,
      },
    });
    return await this.axiosClient.get(url);
  }

  async mediaSimilars(
    id: number,
    params?: { page?: number },
  ): Promise<any> {
    const url = this.swaggerRequest.mediaSimilars({
      version: "v2.2/",
      object: "films/",
      id,
      params: {
        similars: "similars",
      },
    });

    // Добавляем параметры пагинации, если есть
    const fullUrl = `${url}${params?.page ? `?page=${params.page}` : ""}`;
    return await this.axiosClient.get(fullUrl);
  }

  async mediaImages(
    id: number,
    params: { type: string; page?: number },
  ): Promise<{ total: number; totalPages: number; items: KinopoiskImage[] }> {
    const url = this.swaggerRequest.mediaImages({
      version: "v2.2/",
      object: "films/",
      id,
      params: {
        images: "images?",
        type: params.type,
        page: params.page || 1,
      },
    });
    return await this.axiosClient.get(url);
  }

  async searchFilms(params: {
    keyword: string;
    page?: number;
  }): Promise<any> {
    const url = "v2.1/films/search-by-keyword";
    return await this.axiosClient.get(url, {
      keyword: params.keyword,
      page: params.page || 1,
    });
  }

  async getFilters(): Promise<any> {
    const url = "v2.2/films/filters";
    return await this.axiosClient.get(url);
  }

  async getSequelsAndPrequels(id: number): Promise<any> {
    const url = `v2.1/films/${id}/sequels_and_prequels`;
    return await this.axiosClient.get(url);
  }
}



// const swaggerAPI = {
//     mediaByID: async ({id}) => await axiosClient.get(swaggerRequest.mediaByID({version:'v2.2/', object: 'films/', id: id})),
//     mediaCollections: async(params) => await axiosClient.get(swaggerRequest.mediaCollections({version: 'v2.2/', object: 'films/', collection: 'collections?', params })),
//     mediaSimilars: async ({id}, params) => await axiosClient.get(swaggerRequest.mediaSimilars({version:'v2.2/', object: 'films/', id: id, params })),
//     mediaImages: async ({id}, params) => await axiosClient.get(swaggerRequest.mediaImage({version:'v2.2/', object: 'films/', id: id, params })),
// };
// module.exports = { swaggerAPI };

//axiosClient.get(swaggerRequest.mediaByID({version:'v2.2/', object: 'films/', id: id}))
// mediaSimilars: async ({id}) => await axiosClient.get(swaggerRequest.mediaSimilar({version:'v2.2/', object: 'films/', id: id, similars: 'similars'})),
