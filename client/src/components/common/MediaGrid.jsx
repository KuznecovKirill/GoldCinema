import { Grid } from '@mui/material'
import React from 'react'
import MediaItem from './MediaItem'

const MediaGrid = ({medias, mediaType}) => {
  console.log(medias);
  return (
    <Grid container spacing={1} sx={{marginRight: "-8px!important"}}>
        {medias.map((med, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
                <MediaItem media={med} mediaType={mediaType} />
            </Grid>
        ))}
    </Grid>
  )
}

export default MediaGrid