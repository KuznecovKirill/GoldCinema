import { Stack, Typography, Box } from '@mui/material'
import React from 'react'

const Container = ({header, children, sx }) => {
  return (
    <Box sx={{
        marginTop: "5rem",
        marginX: "auto",
        color: "text.primary",
        ...sx
       // maxWidth: "1366px", // Ограничиваем ширину
    //   paddingX: { xs: "1rem", md: "2rem" }
    }}>
        <Stack spacing={4}>
            {header && (
                <Box sx={{
                    position: "relative",
                    paddingX: {xs: "20px", md: 0},
                    maxWidth: "1366px",
                    marginX: "auto",
                    width: "100%",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        left: {xs: "20px", md: "0"},
                        top: "100%",
                        height: "5px",
                        width: "100px",
                        backgroundColor: "primary.main"
                    }
                }}>
                    <Typography variant='h6' fontWeight="700" textTransform="uppercase">
                        {header}
                    </Typography>
                </Box>
            )}
            {children}
        </Stack>

    </Box>
  )
}

export default Container