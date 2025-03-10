import React from 'react'
import MainSlide from '../components/common/MainSlide';
import configs from "../api/configs/configs";

const HomePage = () => {
  return (
    <>
    <MainSlide mediaType={configs.mediaType.FILM}/>
    </>
  )
}

export default HomePage;