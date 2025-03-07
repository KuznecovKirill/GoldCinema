const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '../../.env'),
});
const axios = require("axios");



const get = async (url) => {
    // Выполнение GET-запроса
    console.log(url);
    console.log(process.env);
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