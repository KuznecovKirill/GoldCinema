import React from 'react'
import NavigationSwiper from "./NavigationSwiper"
import { SwiperSlide } from 'swiper/react'
import { Box } from '@mui/material'
import configs from "../../api/configs/configs";
const ImageSlide = ({images}) => {
  return (
    <NavigationSwiper>
        {[...images].splice(0, 10).map((item, index) =>(
            <SwiperSlide key={index} sx={{ maxWidth: "100%" }} >
                <Box sx={{
                    paddingTop: "60%",
                    backgroundPosition: "top",
                    backgroundSize: "cover",
                    backgroundImage: `url(${item.imageUrl})`,
                }} />
            </SwiperSlide>
        )
        )}
    </NavigationSwiper>
  )
};

export default ImageSlide

