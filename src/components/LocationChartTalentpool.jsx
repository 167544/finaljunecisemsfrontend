import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Typography, Box } from '@mui/material';

const LocationChartTalentpool = ({ data }) => {
  // Process the Data to group counts by City
  const processedData = {};

  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== 'band') {
        const city = key || 'Unknown'; // Default to 'Unknown' if city is missing
        if (!processedData[city]) {
          processedData[city] = { city, count: 0 };
        }
        processedData[city].count += item[key];
      }
    });
  });

  // Convert the processed data to an array
  const chartData = Object.values(processedData);

  return (
    <Box sx={chartBoxStyle}>
      <Typography variant="h4" style={{ color: 'white', marginBottom: '10px', textAlign: 'center' }}>
        Location
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <XAxis 
            dataKey="city" 
            stroke="#ffffff" 
            tick={{ fontSize: 10, angle: -45, textAnchor: 'end' }} // Further reduced font size and rotated city names
            interval={0} // Show all city names
          />
          <YAxis stroke="#ffffff" tick={{ fontSize: 10 }} />  // Further reduced font size for Y-axis
          <Tooltip contentStyle={{ fontSize: 10 }} />  // Further reduced font size for tooltip
          <Legend wrapperStyle={{ fontSize: 10 }} />  // Further reduced font size for legend
          <Bar dataKey="count" name="Employee Count" fill="#00E5FF" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

// Styling for the chart container with increased width
const chartBoxStyle = {
  backgroundColor: "#0A2342",
  color: "white",
  padding: "1rem",
  borderRadius: "10px",
  textAlign: "center",
  width: "100%", // Increased the width to 100%
  maxWidth: "1200px", // Set a maximum width if needed
  margin: "0 auto", // Center the box
};

export default LocationChartTalentpool;
