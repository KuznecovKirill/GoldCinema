import { Box, Typography } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';
import { SwiperSlide, Swiper } from 'swiper/react';
//import { Swiper } from 'swiper/types';
import UI from '../../configs/UI';
import configs from '../../api/configs/configs';
import { routesGen } from '../../routes/routes';
import MediaItem from './MediaItem';

const SimilarSlide = ({ similars }) => {
    return (
      <Box sx={{
        "& .swiper-slide": {
          width: { xs: "50%", md: "25%", lg: "20.5%" },
          color: "primary.contrastText"
        }
      }}>
        <Swiper
          spaceBetween={10}
          slidesPerView={"auto"}
          grabCursor={true}
          style={{ width: "100%", height: "max-content" }}
        >
          {similars.map((sim, index) => (
            <SwiperSlide key={index}>
              <MediaItem media={sim} mediaType={sim.mediaType}/>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    );
  };
  
  export default SimilarSlide;

  // <Link to={routesGen.mediaInfo(sim.mediaType, sim.id_media)}>
  //               <Box sx={{
  //                 paddingTop: "120%",
  //                 color: "text.primary",
  //                 ...UI.style.backgroundImage(configs.posterPath(sim.id_media))
  //               }}>
  //                 <Box sx={{
  //                   position: "absolute",
  //                   width: "100%",
  //                   height: "max-content",
  //                   bottom: 0,
  //                   padding: "10px",
  //                   backgroundColor: "rgba(0,0,0,0.6)"
  //                 }}>
  //                   <Typography sx={{...UI.style.typoLines(1, "left")}}>
  //                     {sim.title}
  //                   </Typography>
  //                 </Box>
  //               </Box>
  //             </Link>