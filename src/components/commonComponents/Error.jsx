
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'


const Error = () => {
    const navigate = useNavigate()
  return (
    <Box sx={{display:"flex", justifyContent:"center", alignItems:"center",flexDirection:"column",gap:2,  minHeight:"80vh",p:1 }}>
        <Typography color='error' sx={{fontSize:"2rem"}}>!ooops page not found</Typography>
        <Button onClick={()=> navigate('/employees')} variant='contained'>Go to Home</Button>
    </Box>
  )
}

export default Error;
