require("dotenv").config();
const baseUrl = process.env.BASE_URL;

const getUrl = (version, object, endUrl, params ='') => {
  if (params == ''){
  console.log(`${baseUrl}${version}${object}${endUrl}${params}`);
    return `${baseUrl}${version}${object}${endUrl}${params}`;
  }
  else if (params.length == 1){
    const {param} = params;
    return `${baseUrl}${version}${object}${endUrl}${param}`;
  }
  else if (params.length == 2){
    const {type, page} = params;
    return `${baseUrl}${version}${object}${endUrl}type=${type}&page=${page}`;
  }
  };
  

module.exports = {getUrl};