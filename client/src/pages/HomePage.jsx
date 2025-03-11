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
    {/* <Box marginTop="-4rem" sx={{...UI.style.mainContent }}>
      <Container header="popular Movie">
        <MediaSlide mediaType={configs.mediaType.FILM} mediaCategory={configs.mediaCategory.popular} />
      </Container>
    </Box> */}
    </>
  )
}


export default HomePage;