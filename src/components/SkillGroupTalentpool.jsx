import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Typography, Box } from '@mui/material';

const colors = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1',
  '#a4de6c', '#d0ed57', '#fadb58', '#ffbb28', '#ff7300',
  '#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94'
];

const SkillGroupTalentpool = ({ data }) => {
  const [aggregatedData, setAggregatedData] = useState([]);

  useEffect(() => {
    const aggregateData = () => {
      const bandSkillCount = {};

      data.forEach(row => {
        const band = row.Band;
        const skillGroup = row['Skill Group'];

        if (!bandSkillCount[band]) {
          bandSkillCount[band] = {};
        }

        if (typeof skillGroup === 'string') {
          skillGroup.split(',').forEach(skill => {
            const trimmedSkill = skill.trim();
            if (!bandSkillCount[band][trimmedSkill]) {
              bandSkillCount[band][trimmedSkill] = 0;
            }
            bandSkillCount[band][trimmedSkill]++;
          });
        }
      });

      const formattedData = Object.keys(bandSkillCount).map(band => {
        const bandData = { band };
        Object.keys(bandSkillCount[band]).forEach(skill => {
          bandData[skill] = bandSkillCount[band][skill];
        });
        return bandData;
      });

      setAggregatedData(formattedData);
    };

    aggregateData();
  }, [data]);

  const skillKeys = aggregatedData.length ? Object.keys(aggregatedData[0]).filter(key => key !== 'band') : [];

  return (
    <Box sx={{ textAlign: 'center', width: '100%' }}>
      <Typography variant="h2" style={{ color: 'white', marginBottom: '10px', fontWeight: 'bold' }}>
        BY SKILL WISE
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart layout="vertical" data={aggregatedData} margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
          <XAxis type="number" stroke="#ffffff" />
          <YAxis type="category" dataKey="band" stroke="#ffffff" width={150} tick={{ fontSize: 14, fill: '#ffffff' }} />
          <Tooltip />
          <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ color: '#ffffff' }} />
          {skillKeys.map((key, index) => (
            <Bar dataKey={key} stackId="a" fill={colors[index % colors.length]} key={key} barSize={70}>
              {aggregatedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SkillGroupTalentpool;
