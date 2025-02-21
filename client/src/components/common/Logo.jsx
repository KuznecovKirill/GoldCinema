import { Typography, useTheme } from '@mui/material'
import React from 'react'

const Logo = () => {
    const theme = useTheme();
  return (
    <Typography fontWeight="700" fontSize="1.7rem">
        Gold<span style={{ color: '#FFD700' }}> Cinema</span>

    </Typography>
  )
}
// {{color: theme.palette.primary.main}}
export default Logo;