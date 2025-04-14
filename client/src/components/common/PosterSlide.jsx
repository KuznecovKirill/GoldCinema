import React from 'react'
import {SwiperSlide} from "swiper/react"
import AutoSwiper from "./AutoSwiper"
import { Box } from '@mui/material'
import configs from "../../api/configs/configs";
const PosterSlide = ({posters}) => {
  return (
    <AutoSwiper>
        {[...posters].slice(0,10).map((item, index)=> (
            <SwiperSlide key={index}>
                <Box sx={{
                    paddingTop: "160%",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundImage: `url(${configs.backdropPath(item.file_path)})`
                }}/>
            </SwiperSlide>
        ))}
    </AutoSwiper>

  )
}

export default PosterSlide;