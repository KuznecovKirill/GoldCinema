const axios = require("axios");

const get = async (url) => {
    // Выполнение GET-запроса
    const response = await axios.get(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": key,
        },
  });
  return response.data;
};

export default { get };