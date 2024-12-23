const axios = require("axios");
const { modelMedia } = require("../models/modelMedia");

require('dotenv').config();

const get = async (url) => {
    // Выполнение GET-запроса
    console.log(url);
    const conn = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.KEY,
        },
      });
      const result = await conn.json();
      return result;
};

module.exports = { get };