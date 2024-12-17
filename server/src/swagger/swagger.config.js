require("dotenv").config();
const baseUrl = process.env.BASE_URL;
const key = process.env.KEY;

const getUrl = (version, object, endUrl, params ='') => {
  console.log(`${baseUrl}${version}${object}${endUrl}${params}`);
    return `${baseUrl}${version}${object}${endUrl}${params}`;
  };

module.exports = {getUrl};