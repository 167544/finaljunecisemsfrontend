import React from 'react';
import { Box } from '@mui/material';
import FooterBar from '../scenes/global/Footer'; // Adjust the import path as per your actual project structure

const FinanceExternal = () => {
  const openPowerBI = () => {
    window.open('https://app.powerbi.com/groups/ad189f19-f0f0-4658-b243-e17584a83f39/reports/95ab2eba-6696-465f-95c3-55e7981469cc/ReportSection2d89fa6d7ab7b8a6c586?experience=power-bi', '_blank');
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, background: 'url("/path/to/background-image.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Content */}
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <button onClick={openPowerBI} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Open Finance Report
          </button>
        </Box>
      </div>
      <div style={{ height: '20vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* Adjusted to ensure FooterBar background is not overridden */}
       
      </div>
    </div>
  );
};

export default FinanceExternal;
