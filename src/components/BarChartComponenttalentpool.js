import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Typography } from '@mui/material';

const BandGraphComponenttalentpool = ({ bandData }) => {
  return (
    <div style={{ padding: '1rem', borderRadius: '10px' }}>
      <Typography variant="h2" style={{ color: 'white', marginBottom: '10px', textAlign: 'center' }}>
        Talent Pool Band Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={bandData}>
          <XAxis dataKey="band" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#00E5FF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BandGraphComponenttalentpool;
