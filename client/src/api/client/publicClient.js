import axios from "axios";
import queryString from "query-string";

const baseURL = "http://localhost:8000";

const publicClient = axios.create({
    baseURL,
    paramsSerializer: {
        encode: params => queryString.stringify(params)
    }
})

publicClient.interceptors.request.use(async config => {
    return {
        ...config,
        headers: {
            "Content-Type": "application/json"
        }
    }
})
publicClient.interceptors.response.use((response) => {
    if (response?.data) return response.data;
    return response;
  }, (error) => {
    throw error.response.data;
  });
  export default publicClient;
  //if (response?.data)

  //response && response.data