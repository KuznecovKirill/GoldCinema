// src/modules/external-api/axios.client.ts
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

@Injectable()
export class AxiosClient {
  constructor(private readonly configService: ConfigService) {}

  private get apiKey(): string {
    return this.configService.get<string>("KEY") || "";
  }

  private get baseUrl(): string {
    return "https://kinopoiskapiunofficial.tech/api/";
  }

  async get<T = any>(
    url: string,
    params?: Record<string, any>,
  ): Promise<T> {
    try {
      // Собираем полный URL с параметрами
      let fullUrl = url.startsWith("http") ? url : `${this.baseUrl}${url}`;
      
      if (params && Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(params).toString();
        fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${queryString}`;
      }

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      return await response.json() as Promise<T>;
    } catch (error) {
      console.error("AxiosClient error:", error);
      throw error;
    }
  }

  async post(url: string, data?: any): Promise<unknown> {
    try {
      const fullUrl = url.startsWith("http") ? url : `${this.baseUrl}${url}`;
      
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.apiKey,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("AxiosClient error:", error);
      throw error;
    }
  }
}



// const path = require('path');
// require('dotenv').config({
//   path: path.join(__dirname, '../../.env'),
// });
// const axios = require("axios");



// const get = async (url) => {
//     // Выполнение GET-запроса

//     // console.log(process.env);
//     console.log(url);
//     const conn = await fetch(url, {
//         method: 'GET',
//         headers: {
//           "Content-Type": "application/json",
//           "X-API-KEY": process.env.KEY,
//         },
//       });
//       const result = await conn.json();
//       return result;
// };

// module.exports = { get };