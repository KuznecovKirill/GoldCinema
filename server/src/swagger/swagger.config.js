const baseUrl = process.env.API_URL;
const key = process.env.KEY;

const getUrl = (id, params) => {
  
    return `${baseUrl}${id}${params}`;
  };
  module.exports = getUrl;
  export default { getUrl };