// Зачем использовать два разных файла, если можно обойтись лишь одним?
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import queryString from "query-string";

const baseURL = "http://localhost:8000/goldcinema/v1";

const instance = axios.create({
  baseURL,
  paramsSerializer: {
    encode: (params) => queryString.stringify(params),
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("abcde");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// Возвращаем сразу data из ответа
instance.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    throw error.response?.data || error;
  }
);

// Определяем интерфейс, чтобы TypeScript знал, что методы возвращают Promise<T>, а не Promise<AxiosResponse<T>>
interface TypedAxiosClient {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export const axiosClient = instance as unknown as TypedAxiosClient;
export default axiosClient;