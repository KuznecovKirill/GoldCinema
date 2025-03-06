import React from 'react'
import publicClient from '../client/publicClient';
const genreEndpoints = {
    list: ({ mediaType }) => `/medias/genres`,
    listByType: ({mediaType}) => `/medias/genres/${mediaType}`
  };
  
  const genreModule = {
    getList: async ({ mediaType }) => {
      try {
        const response = await publicClient.get(genreEndpoints.list({ mediaType }));
  
        return { response };
      } catch (err) { return { err }; }
    }
  };

export default genreModule;