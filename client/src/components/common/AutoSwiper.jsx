import { Box } from '@mui/material'
import React from 'react'
import {Swiper} from "swiper/react"

const AutoSwiper = ({value}) => {
  return (
    <Box sx={{
        "& .swiper-slide": {
            width: {
                xs: "50%",
                sm: "35%",
                md: "25%",
                lg: "20.5%"
            }
        }
    }}>
        <Swiper slidesPerView="auto" grabCursor={true} style={{width: "100%", height: "max-content"}}
        >
            {value}
        </Swiper>
    </Box>
  )
}

export default AutoSwiper;