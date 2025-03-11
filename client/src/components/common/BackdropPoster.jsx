import React from 'react'
import NavigationSwiper from "./NavigationSwiper"
import { SwiperSlide } from 'swiper/react'
import { Box } from '@mui/material'
import configs from "../../api/configs/configs";
const BackdropPoster = ({poster}) => {
  return (
    <NavigationSwiper>
        {[...poster].splice(0, 10).map((item, index) =>(
            <SwiperSlide key={index}>
                <Box sx={{
                    paddingTop: "60%",
                    backgroundPosition: "top",
                    backgroundSize: "cover",
                    backgroundImage: `url(${configs.backdropPath(item.file_path)})`
                }} />
            </SwiperSlide>
        )
        )}
    </NavigationSwiper>
  )
};

export default BackdropPoster