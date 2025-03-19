import React from 'react'
import UI from "../../configs/UI";
import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
const HeaderPoster = ({posterPath}) => {
    const theme = useTheme();
  return (
    <Box sx={{
        zIndex: "-1",
        position: "relative",
        //height: "50vh",
        paddingTop: {xs: "60%", sm: "40%", md: "35%"},
        backgroundPosition: "top",
        backgroundSize: "cover",
        backgroundImage: `url(${posterPath})`,
        backgroundAttachment: "fixed",
        "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            ...UI.style.gradientBgImage[theme.palette.mode]
        }
    }} />
  );
};

export default HeaderPoster