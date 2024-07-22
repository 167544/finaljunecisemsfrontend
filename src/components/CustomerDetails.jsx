// src/pages/CustomerDetails.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // Example icon for percentage
import { useNavigate } from 'react-router-dom';

// Import local logo images
import logo1 from '../../src/Assets/accountlogos/aptiagrouplogo.png';
import logo2 from '../../src/Assets/accountlogos/ninetyonelogo.png';
import logo3 from '../../src/Assets/accountlogos/wolterskluwer.png';
import logo4 from '../../src/Assets/accountlogos/cloverHealthlogo.png';
import logo5 from '../../src/Assets/accountlogos/compasslogo.png';

const theme = createTheme();

const CustomerDetails = () => {
  const tiles = Array.from({ length: 35 }, (_, index) => index + 1);
  const navigate = useNavigate();

  // Array of imported logo images, indexed to correspond with the tile numbers
  const logos = {
    1: logo1,
    2: logo2,
    3: logo3,
    4: logo4,
    5: logo5,
  };

  const handleTileClick = (tile) => {
    navigate(`/account/${tile}`);
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
            gridTemplateColumns: 'repeat(5, 1fr)', // Set 5 tiles per row
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
            width: '100%', // Ensure the container takes the full width
            maxWidth: '1600px', // Increased max width for the container
          }}
        >
          {tiles.map((tile) => (
            <Box
              key={tile}
              onClick={() => handleTileClick(tile)}
              sx={{
                position: 'relative', // Added to position the tile number
                backgroundColor: '#0A2342', // Updated tile color
                color: 'white',
                height: '300px', // Height of the tile
                width: '100%', // Ensure the tile takes the full width of its container
                maxWidth: '320px', // Increased maximum width for the tiles
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center', // Center the content
                padding: '10px', // Added padding for better spacing
                borderRadius: '8px',
                transition: 'transform 0.3s, background-color 0.3s',
                cursor: 'pointer', // Change cursor to pointer for all tiles
                '&:hover': {
                  transform: 'scale(1.05)',
                  backgroundColor: '#4A90E2',
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  fontSize: '0.8rem',
                  color: 'white',
                }}
              >
                {tile}
              </Typography>
              {logos[tile] && (
                <img 
                  src={logos[tile]} // Map each tile to its corresponding logo
                  alt={`Account ${tile} Logo`}
                  style={{ width: '150px', height: '180px', marginBottom: '10px' }} // Increase the size of the logo
                />
              )}
              <Typography variant="h5" sx={{ marginTop: 'auto' }}>
                {tile === 1 ? "Aptia" 
                 : tile === 2 ? "NinetyOne" 
                 : tile === 3 ? "Wolters Kluwer" 
                 : tile === 4 ? "Clover Health" 
                 : tile === 5 ? "Compass Group" 
                 : `Account ${tile}`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <HealthAndSafetyOutlinedIcon sx={{ fontSize: 20, marginRight: '4px' }} /> {/* Decreased icon size */}
                <Typography variant="body2" sx={{ marginRight: '4px' }}>Health Check Status</Typography> {/* Decreased text size */}
                <TrendingUpIcon sx={{ fontSize: 20, marginRight: '4px' }} /> {/* Icon for percentage */}
                <Typography variant="body2">85%</Typography> {/* Example percentage */}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CustomerDetails;
