import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import UploadTalentpool from "../../components/UploadTalentpool";
import BandGraphComponenttalentpool from "../../components/BarChartComponenttalentpool"; // Import BandGraphComponenttalentpool

const Talentpool = () => {
  const [bandData, setBandData] = useState([]);
  const [uploadedData, setUploadedData] = useState([]);

  useEffect(() => {
    fetchTalentpoolData(); // Fetch talent pool data when component mounts
  }, []);

  const fetchTalentpoolData = async () => {
    try {
      const response = await axios.get('http://localhost:3004/talent'); // Fetch talent pool data from backend
      const data = response.data;
      setUploadedData(data); // Store fetched data in state
      prepareBandData(data); // Prepare band data from talent pool data
    } catch (error) {
      console.error('Error fetching talent pool data:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const prepareBandData = (data) => {
    const bandCount = data.reduce((acc, item) => {
      const band = item.Band;
      acc[band] = (acc[band] || 0) + 1;
      return acc;
    }, {});

    const formattedData = Object.entries(bandCount).map(([band, count]) => ({
      band,
      count
    }));

    setBandData(formattedData);
  };

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom style={{ color: 'white' }}>
        Talent Pool
      </Typography>
      {bandData.length > 0 && <BandGraphComponenttalentpool bandData={bandData} />} {/* Render BandGraphComponenttalentpool */}
      <UploadTalentpool uploadedData={uploadedData} /> {/* Render UploadTalentpool */}
    </Box>
  );
};

export default Talentpool;
