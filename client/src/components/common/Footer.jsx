import React from 'react'
import Container from './Container'
import { Paper, Stack, Button, Box } from '@mui/material'
import Logo from './Logo'
import menuConfigs from "../../configs/menu"
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <Container>
        <Paper square={true} sx={{
            backgroundImage: "unset", 
            padding: "2rem"
            }}>
        </Paper>
        <Stack 
        alignItems="center"
        justifyContent='space-between'
        direction={{xs: "column", md: "row"}}
        sx={{height: "max-content"}}
        >
            <Logo/>
            <Box>
            {menuConfigs.main.map((item, index) => (
              <Button
                key={index}
                sx={{ color: "inherit" }}
                component={Link}
                to={item.path}
              >
                {item.display}
              </Button>
            ))}
          </Box>

        </Stack>
    </Container>
  )
}

export default Footer