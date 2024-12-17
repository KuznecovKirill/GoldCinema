require("dotenv").config();
const baseUrl = process.env.BASE_URL;
const key = process.env.KEY;

const getUrl = (version, object, endUrl, params ='') => {
  if (params == ''){
  console.log(`${baseUrl}${version}${object}${endUrl}${params}`);
    return `${baseUrl}${version}${object}${endUrl}${params}`;
  }
  else{
    const {type, page} = params;
    return `${baseUrl}${version}${object}${endUrl}type=${type}&page=${page}`;
  }
  };
  

module.exports = {getUrl};