import Grid from '@mui/material/GridLegacy';
import React from 'react'
import MediaItem from './MediaItem'

const MediaGrid = ({medias, mediaType}) => {
  console.log(medias);
  return (
    <Grid container spacing={1} sx={{marginRight: "-8px!important"}}>
        {medias.map((med) => (
            <Grid item xs={6} sm={4} md={3} key={med.id_media}>
                <MediaItem media={med} mediaType={mediaType} />
            </Grid>
        ))}
    </Grid>
  )
}

export default MediaGrid