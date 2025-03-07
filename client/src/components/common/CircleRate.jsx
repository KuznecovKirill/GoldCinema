import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'

const CircleRate = ({value}) => {
    if (value === null) {
        return null;
      }
  return (
    
    <Box sx={{
        position: "relative",
        display: "inline-block",
        width: "max-content"
    }}>
        <CircularProgress variant='determinate' value={value * 10} color='success' size={60}/>
        <Box sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Typography
            variant="caption"
            component="div"
            fontWeight="800"
             fontSize="1.2rem"
            // sx={{marginTop: "5px"}}
            >
                {Math.floor(value * 10) / 10}
            </Typography>
        </Box>
    </Box>
  )
}

export default CircleRate;