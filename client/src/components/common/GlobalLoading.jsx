import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Paper, Box, LinearProgress, Toolbar } from "@mui/material";
import Logo from './Logo';


export const GlobalLoading = () => {
    const { globalLoading } = useSelector((state) => state.globalLoading);
    const [first, setfirst] = useState(false);
    useEffect(() => {
      if (globalLoading){
        setfirst(true)
      }
      else{
        setTimeout(() => {
            setfirst(false)
        }, 1000);
      }
    }, [globalLoading])
    
  return (
    <div>
        <Paper sx= {{
            opacity: first ? 1 : 0,
            pointerEvents: "none",
            transition: "all .4s ease",
            position: "fixed",
            width: "100vw",
            height: "100vh",
            zIndex: 1000
        }}>
            <Toolbar/>
            <LinearProgress sx={{
              backgroundColor: '#FFD700', // Золото
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#FFD700',
              },
            }} 
          />
            <Box sx ={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}>
                <Logo />
            </Box>

        </Paper>
    </div>
  )
}
export default GlobalLoading;
