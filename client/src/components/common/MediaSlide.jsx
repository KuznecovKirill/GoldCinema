import React, { useState, useEffect } from 'react'
import mediaModule from '../../api/modules/mediaModule';
import { toast } from 'react-toastify';
import  AutoSwiper from "../common/AutoSwiper";
import { SwiperSlide } from "swiper/react";
import MediaItem from './MediaItem';
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
          console.log(response.medias);
          if (response) setMedias(response.medias);
          if (err) toast.error(err.message);
        };
        getMedias();
    }, [mediaType, mediaCategory]);
    return (
        <AutoSwiper>
          {medias.map((media, index) => (
            <SwiperSlide key={index}>
              <MediaItem media={media} mediaType={mediaType}/>
            </SwiperSlide>
          ))}
        </AutoSwiper>
      );
}

export default MediaSlide;