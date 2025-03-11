import { Grid, Grid2 } from '@mui/material'
import React from 'react'

const MediaGrid = (media, mediaType) => {
  return (
    <Grid2 container spacing={1} sx={{marginRight: "-8px!important"}}>
        {media.map((med, index) => (
            <Grid2 item xs={6} sm={4} md={3} key={index}>
                //MediaItem нужен
            </Grid2>
        ))}
    </Grid2>
  )
}

export default MediaGrid