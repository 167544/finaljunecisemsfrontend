// src/pages/CustomerDetails.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();

const CustomerDetails = () => {
  const tiles = Array.from({ length: 35 }, (_, index) => index + 1);
  const navigate = useNavigate();

  const handleTileClick = (tile) => {
    if (tile === 1) {
      navigate(`/account/${tile}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: '#102E4A',
          minHeight: '100vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3" sx={{ color: 'white', marginTop: '20px' }}>
          Accounts
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)', // 5 tiles per row
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          {tiles.map((tile) => (
            <Box
              key={tile}
              onClick={() => handleTileClick(tile)}
              sx={{
                backgroundColor: '#0A2342', // Updated tile color
                color: 'white',
                height: '300px', // Increased height
                width: '250px', // Increased width
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center', // Center the content
                padding: '10px', // Added padding for better spacing
                borderRadius: '8px',
                transition: 'transform 0.3s, background-color 0.3s',
                cursor: tile === 1 ? 'pointer' : 'default', // Change cursor to pointer only for the first tile
                '&:hover': tile === 1 ? {
                  transform: 'scale(1.05)',
                  backgroundColor: '#4A90E2',
                } : {},
              }}
            >
              <Typography variant="h4" sx={{ marginBottom: 'auto' }}>{`Account ${tile}`}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
                <HealthAndSafetyOutlinedIcon sx={{ fontSize: 40, marginRight: '8px' }} />
                <Typography variant="h6">Health Check Status</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CustomerDetails;
