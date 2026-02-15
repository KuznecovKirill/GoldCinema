// src/modules/external-api/swagger.request.ts
import { SwaggerConfig } from "./swagger.config";

export interface MediaByIdParams {
  version: string;
  object: string;
  id: number;
}

export interface MediaCollectionsParams {
  version: string;
  object: string;
  collection: string;
  params: {
    type: string;
    page: number;
  };
}

export interface MediaSimilarsParams {
  version: string;
  object: string;
  id: number;
  params: {
    similars?: string;
  };
}

export interface MediaImagesParams {
  version: string;
  object: string;
  id: number;
  params: {
    images?: string;
    type: string;
    page: number;
  };
}

export class SwaggerRequest {
  private readonly config = new SwaggerConfig();

  mediaByID({ version, object, id }: MediaByIdParams): string {
    return this.config.getUrl(version, object, `${id}`);
  }

  mediaCollections({ version, object, collection, params }: MediaCollectionsParams): string {
    return this.config.getUrl(version, object, collection, params);
  }

  mediaSimilars({ version, object, id, params }: MediaSimilarsParams): string {
    return this.config.getUrl(version, object, `${id}/`, params);
  }

  mediaImages({ version, object, id, params }: MediaImagesParams): string {
    return this.config.getUrl(version, object, `${id}/`, params);
  }
}



// const config = require('./swagger.config');

// const swaggerRequest = {
//     mediaByID: ({version, object, id}) => config.getUrl(version, object, id),
//     mediaCollections: ({version, object, collection, params}) => config.getUrl(version, object, collection, params),
//     mediaSimilars: ({version,object,id, params}) => config.getUrl(version,object,id, params),
//     mediaImage: ({version, object,id,params}) => config.getUrl(version,object,id, params),
// };
// module.exports = { swaggerRequest };

// mediaSimilars: ({version,object,id}) => config.getUrl(version,object,id, params)