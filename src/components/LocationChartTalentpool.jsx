// LocationChartTalentpool.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Typography, Box } from '@mui/material';

const LocationChartTalentpool = ({ data }) => {
  const colors = [
    '#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F',
    '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC',
    '#76A7B5', '#A1C58E', '#F9DC5C', '#FFB3BA', '#8CD790'
  ];

  const locationKeys = data.length ? Object.keys(data[0]).filter(key => key !== 'band') : [];

  return (
    <Box sx={chartBoxStyle}>
      <Typography variant="h2" style={{ color: 'white', marginBottom: '10px', textAlign: 'center' }}>
        BY LOCATION
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="horizontal" margin={{ left: 100 }}>
          <XAxis type="category" dataKey="band" stroke="#ffffff" />
          <YAxis type="number" stroke="#ffffff" />
          <Tooltip />
          <Legend 
            layout="vertical" 
            align="left" 
            verticalAlign="middle"
            wrapperStyle={{ left: 0, top: '50%', transform: 'translate(0, -50%)' }} 
          />
          {locationKeys.map((key, index) => (
            <Bar dataKey={key} stackId="a" fill={colors[index % colors.length]} key={key} barSize={80}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const chartBoxStyle = {
  backgroundColor: "#0A2342",
  color: "white",
  padding: "1rem",
  borderRadius: "10px",
  textAlign: "center",
  width: "100%",
};

export default LocationChartTalentpool;
