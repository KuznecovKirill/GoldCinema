import React from 'react'
import MainSlide from '../components/common/MainSlide';
import configs from "../api/configs/configs";
import { Box } from '@mui/material';
import UI from "../configs/UI";
import Container from "../components//common/Container";
import MediaSlide from '../components/common/MediaSlide';
const HomePage = () => {
  return (
    <>
    <MainSlide mediaType={configs.mediaType.FILM} mediaCategory={configs.mediaCategory.popular}/>
    <Box marginTop="-4rem" sx={{...UI.style.mainContent }}>
      <Container header="Популярные фильмы">
        <MediaSlide mediaType={configs.mediaType.FILM} mediaCategory={configs.mediaCategory.popular} />
      </Container>
      <Container header="Популярные сериалы">
        <MediaSlide mediaType={configs.mediaType.TV_SERIES} mediaCategory={configs.mediaCategory.popular} />
      </Container>
      <Container header="Лучшие фильмы">
        <MediaSlide mediaType={configs.mediaType.FILM} mediaCategory={configs.mediaCategory.top_rated} />
      </Container>
      <Container header="Лучшие сериалы">
        <MediaSlide mediaType={configs.mediaType.TV_SERIES} mediaCategory={configs.mediaCategory.top_rated} />
      </Container>
    </Box>
    </>
  )
}


export default HomePage;