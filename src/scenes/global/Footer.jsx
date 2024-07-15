import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 0.05,
        px: 0.1,
        mt: 'auto',
        backgroundColor: 'transparent', // Remove background color
        textAlign: 'center',
        color: 'white', // Adjust text color for better visibility on transparent background
      }}
    >
      <Typography variant="body1" sx={{ color: 'white' }}>
        CIS Management Information System © 2024
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: 'white' }}>
        Version 1.0.0
      </Typography>
    </Box>
  );
}

export default Footer;
