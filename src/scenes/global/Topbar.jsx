import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import logos from '../../Assets/logo.jpg';

const Topbar = (props) => {
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.removeItem('token');
      window.location.reload();
    }
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2} ml={0.2} sx={{ background: "transparent" }}>
      <img src={logos} alt="logo" width={"50px"} height={"50px"} />
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          color: "white",  // Set text color to white
          fontWeight: "bold", 
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", 
          fontFamily: "'Roboto', sans-serif", 
          fontSize: "2rem",  // Increase font size
        }}
      >
        CIS Management Information System
      </Typography>
      <Box style={{ display: 'flex' }}>
        <IconButton onClick={handleLogout}>
          <PersonOutlinedIcon style={{ color: "black" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
