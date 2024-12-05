require('dotenv').config();
const baseUrl = process.env.BASE_URL;
const key = process.env.KEY;

const getUrl = (version, object, endUrl) => {
    return `${baseUrl}${version}${object}${endUrl}`;
  };

module.exports = {getUrl};