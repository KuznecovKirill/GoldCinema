import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {toast} from "react-toastify";

import {setGlobalLoading} from "../redux/slices/globalLoadingSlice";
import { setAuthModalOpen } from '../redux/slices/authModalSlice';

import mediaModule from "../api/modules/mediaModule";
const MediaPage = () => {
  const {mediaType, id_media} = useParams();
  console.log(id_media);
  const {list, listFavorites} = useSelector((state) => state.user);

  const [media, setMedia] = useState();
  const [onRequest, setOnRequest] = useState(false);
  const [genres, setGenres] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0,0);
    const getMedia = async() => {
      dispatch(setGlobalLoading(true));
      
      const {response, err} = await mediaModule.getInfo({id_media});
      dispatch(setGlobalLoading(false));

      if (response){
        setMedia(response);
        //
        setGenres(response.genres.splice(0,2));
      }
      if (err) toast.error(err.message);
    };

    getMedia();
  }, [mediaType, id_media, dispatch]);

  //Добавить клик на избранное
  //Добавить клик на избранное для удаления
  return (
    <div>MediaPage</div>
  )
}

export default MediaPage