import React from "react";
import { Box, Typography } from "@mui/material";

const BandTiles = ({ bandData }) => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center" mb={4}>
      {bandData.map((band) => (
        <Box
          key={band.band}
          bgcolor="#0A2342"
          color="white"
          p={2}
          m={1}
          borderRadius="8px"
          boxShadow={3}
          width="150px"
          textAlign="center"
        >
          <Typography variant="h6">{band.band}</Typography>
          <Typography variant="body1">Count: {band.count}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default BandTiles;
