import React, { useState, useEffect } from 'react'
import mediaModule from '../../api/modules/mediaModule';
import { toast } from 'react-toastify';
import  AutoSwiper from "../common/AutoSwiper";
import { SwiperSlide } from "swiper/react";
const MediaSlide = ({mediaType, mediaCategory}) => {
    const [medias, setMedias] = useState([]);
    useEffect(() => {
        const getMedias = async () => {
          const { response, err } = await mediaModule.getMedias({
            mediaType,
            mediaCategory,
            page: 1,
            limit: 10
          });
          console.log(response);
          if (response) setMedias(response.medias);
          if (err) toast.error(err.message);
        };
        getMedias();
        console.log(medias);
    }, [mediaType, mediaCategory]);
    return (
        <AutoSwiper>
          {medias.map((media, index) => (
            <SwiperSlide key={index}>
              
            </SwiperSlide>
          ))}
        </AutoSwiper>
      );
}

export default MediaSlide