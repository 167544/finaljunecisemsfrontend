import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { Typography } from '@mui/material';

// const data = [
//   { name: 'Active TP', value: 13, color: '#0088FE' },
//   { name: 'Serving Notice', value: 9, color: '#00C49F' },
//   { name: 'Maternity Leave', value: 7, color: '#FFBB28' },
//   { name: 'To be Allocated', value: 4, color: '#FF8042' },
//   { name: 'Exit', value: 85, color: '#A28C88' },
//   { name: 'CIS Allocated', value: 126, color: '#1F78B4' },
// ];

const PieChartTalentpoolComponent = ({ data }) => { // Accept data as prop
  return (
    <div style={{ padding: '1rem', borderRadius: '10px' }}>
      <Typography variant="h3" style={{ color: 'white', marginBottom: '10px', textAlign: 'center' }}>
        Overall TP Status till date
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}  // Use dynamic data from props
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent }) => `${name} : ${value}, ${Math.round(percent * 100)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <Label value="Overall TP Status" position="center" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};


export default PieChartTalentpoolComponent;
