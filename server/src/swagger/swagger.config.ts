// src/modules/external-api/swagger.config.ts
export class SwaggerConfig {
  private readonly baseUrl = "https://kinopoiskapiunofficial.tech/api/";

  getUrl(
    version: string,
    object: string,
    endUrl: string,
    params?: Record<string, any>,
  ): string {
    let url = `${this.baseUrl}${version}${object}${endUrl}`;

    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    // Обработка различных типов параметров
    if (params.similars) {
      url += `similars`;
    } else if (params.collection) {
      const { type, page } = params;
      url += `collections?type=${type}&page=${page}`;
    } else if (params.images) {
      const { type, page } = params;
      url += `images?type=${type}&page=${page}`;
    } else if (params.type && params.page) {
      url += `?type=${params.type}&page=${params.page}`;
    }

    return url;
  }
}

// require('dotenv').config();
// //const baseUrl = process.env.BASE_URL;

// const getUrl = (version, object, endUrl, params ='') => {
//   const baseUrl = "https://kinopoiskapiunofficial.tech/api/"
//   console.log(params[Object.keys(params)[0]]);
//   const count = Object.keys(params).length; //кол-во элементов у params
//   if (count == 0){
//   console.log(`${baseUrl}${version}${object}${endUrl}${params}`);
//     return `${baseUrl}${version}${object}${endUrl}${params}`;
//   }
//   else if (params[Object.keys(params)[0]] == 'similars'){
//     const {similars} = params;
//     return `${baseUrl}${version}${object}${endUrl}${similars}`;
//   }
//   else if (count == 2){
//     const {type, page} = params;
//     return `${baseUrl}${version}${object}${endUrl}type=${type}&page=${page}`;
//   }
//   else if (params[Object.keys(params)[0]] == 'images?'){
//     const {images, type, page} = params;
//     console.log(`${baseUrl}${version}${object}${endUrl}${images}type=${type}&page=${page}`);
//     return `${baseUrl}${version}${object}${endUrl}${images}type=${type}&page=${page}`
//   }
//   };
// //https://kinopoiskapiunofficial.tech/api/v2.2/films/464963/images?type=SCREENSHOT&page=1

// module.exports = {getUrl};