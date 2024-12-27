require("dotenv").config();
const baseUrl = process.env.BASE_URL;

const getUrl = (version, object, endUrl, params ='') => {
  console.log(params.similars);
  const count = Object.keys(params).length; //кол-во элементов у params
  if (count == 0){
  console.log(`${baseUrl}${version}${object}${endUrl}${params}`);
    return `${baseUrl}${version}${object}${endUrl}${params}`;
  }
  else if (count == 1){
    const {similars} = params;
    return `${baseUrl}${version}${object}${endUrl}${similars}`;
  }
  else if (count == 2){
    const {type, page} = params;
    return `${baseUrl}${version}${object}${endUrl}type=${type}&page=${page}`;
  }
  };
  

module.exports = {getUrl};