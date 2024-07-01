import React from "react";
import { Box, IconButton } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import logos from '../../Assets/logo.jpg';

const Topbar = (props) => {
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.removeItem('token');
      window.location.reload();
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2} ml={0.2}>
      <img src={logos} alt="logo" width={"50px"} height={"50px"} />
      <h2 style={{ color: "white", fontWeight: "bold" }}>CIS Management Information System</h2>

      {/* ICONS */}
      <Box style={{ display: 'flex' }}>
        <IconButton onClick={handleLogout}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
