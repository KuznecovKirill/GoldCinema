import axios from "axios";
import queryString from "query-string";

const baseURL = "http://localhost:8000";

const client = axios.create({
    baseURL,
    paramsSerializer: {
        encode: params => queryString.stringify(params)
    }
})

client.interceptors.request(async config => {
    return {
        ...config,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    }
})
client.interceptors.response.use((response) => {
    if (response && response.data) return response.data;
    return response;
  }, (error) => {
    throw error.response.data;
  });
  export default client;