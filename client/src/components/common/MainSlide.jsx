import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Button, Chip, Divider, Stack, Typography, useTheme } from "@mui/material";

import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from 'swiper/modules';

import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {setGlobalLoading} from "../../redux/slices/globalLoadingSlice";
import {routeGen} from "../../routes/routes";
import uiConfigs from "../../configs/UI";
import CircleRate from "./CircleRate";
import configs from "../../api/configs/configs";

import genreModule from "../../api/modules/genreModule";
import mediaModule from "../../api/modules/mediaModule";
const MainSlide = ({mediaType}) => {
    const theme = useTheme();
    const dispatch = useDispatch();
  
    const [medias, setMedias] = useState([]);
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const getMedias = async () => {
          const { response, err } = await mediaModule.getMedias({
            mediaType,
            page: 1,
            limit: 10
          });
          if (response){ 
            setMedias(response.medias);
          }
          if (err) toast.error(err.message);
          dispatch(setGlobalLoading(false));
    };
    const getGenres = async () => {
        dispatch(setGlobalLoading(true));
        const { response, err } = await genreModule.getList({ mediaType });
  
        if (response) {
          setGenres(response.genres);
          getMedias();
        }
        if (err) {
          toast.error(err.message);
          setGlobalLoading(false);
        }
      };
  
      getGenres();
    }, [mediaType, dispatch]);
    
    return (
        <Box sx={{
            position: "relative",
            color: "primary.contrastText",
            "&::before": {
              content: '""',
              width: "100%",
              height: "30%",
              position: "absolute",
              bottom: 0,
              left: 0,
              zIndex: 2,
              pointerEvents: "none",
              ...uiConfigs.style.gradientBgImage[theme.palette.mode]
            }
          }}>
            <Swiper 
            grabCursor={true}
            loop={true}
            modules={[Autoplay]}
            style={{width: "100%", height: "max-content"}}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false
            }}
            >
              {medias.map((med, index) => (
                <SwiperSlide key={index}>
                  <Box sx={{
                    paddingTop: {
                      xs: "110%",
                      sm: "70%",
                      md: "50%",
                      lg: "35%",
                      '@media (min-width: 1200px)': { 
                        paddingTop: '40%',},
                    },
                    overflow: 'hidden',
                    backgroundPosition: "top",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    // backgroundImage: `url(${configs.backdropPath(med.id_media)})`,
                    backgroundImage: `url(${med.cover})`,
                  }}>

                  </Box>

                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
    );
};
export default MainSlide;
