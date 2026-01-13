import { Box } from '@mui/material';
import React from 'react';
import MediaItem from './MediaItem';

const MediaGrid = ({ medias, mediaType }) => {
  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: {
        xs: 'repeat(2, 1fr)',      // 2 на мобиле <600px
        sm: 'repeat(3, 1fr)',      // 3 на планшете 600-900px  
        md: 'repeat(4, 1fr)',      // 4 на малом десктопе 900-1200px
        lg: 'repeat(6, 1fr)',      // 6 на большом экране >1200px
      },
      gap: 1.2,
      p: { xs: 0.5, md: 1.5 },  // Меньше отступы на мобиле
      maxWidth: '100%'
    }}>
      {medias.map((media, index) => (
        <Box 
          key={media.id_media || index} 
          sx={{ 
            width: '100%', 
            height: { xs: 200, sm: 220, md: 240, lg: 260 },  // Высота растёт с экраном
            '& > *': { width: '100%', height: '100%' }
          }}
        >
          <MediaItem media={media} mediaType={mediaType} />
        </Box>
      ))}
    </Box>
  );
};

export default MediaGrid;
