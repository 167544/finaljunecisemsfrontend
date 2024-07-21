// src/pages/Account1Details.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const items = [
  { label: 'SOW', angle: 45 },
  { label: 'P&L', angle: 135 },
  { label: 'PIP', angle: 225 },
  { label: 'Monthly Review Pack', angle: 315 },
];

const Account1Details = () => {
  const radius = 100; // Radius for the circle

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: '#102E4A',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            backgroundColor: '#0A2342',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <Typography variant="h5" sx={{ color: 'white' }}>
            Account 1
          </Typography>
          
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                top: `${50 + radius * Math.sin((item.angle * Math.PI) / 180)}%`,
                left: `${50 + radius * Math.cos((item.angle * Math.PI) / 180)}%`,
                transform: 'translate(-50%, -50%)',
                width: '180px',
                height: '50px',
                backgroundColor: '#0A2342',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6">{item.label}</Typography>
            </Box>
          ))}

          {/* Connecting lines */}
          {items.map((item, index) => (
            <Box
              key={`line-${index}`}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${radius}px`,
                height: '1px',
                backgroundColor: 'white',
                transformOrigin: '0 0',
                transform: `rotate(${item.angle}deg)`,
                zIndex: -1,
              }}
            />
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Account1Details;
