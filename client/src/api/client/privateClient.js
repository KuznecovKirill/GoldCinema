import axios from "axios";
import queryString from "query-string";

const baseURL = "http://localhost:8000";

const privateClient = axios.create({
    baseURL,
    paramsSerializer: {
        encode: params => queryString.stringify(params)
    }
})

privateClient.interceptors.request.use(async config => {
    return {
        ...config,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("abcde")}`,
        }
    }
})
privateClient.interceptors.response.use((response) => {
    if (response?.data) return response.data;
    return response;
  }, (error) => {
    throw error.response.data;
  });
  export default privateClient;