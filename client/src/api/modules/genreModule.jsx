import React from 'react'
import publicClient from '../client/publicClient';
const genreEndpoints = {
    list: ({ mediaType }) => `${mediaType}/genres`
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