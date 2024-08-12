import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import UpdateTalentpoolUserDetails from "../components/UpdateTalentpoolUserDetails "; // Import the update component

const ManageTalentPool = () => {
  const [uploadedData, setUploadedData] = useState([]);

  useEffect(() => {
    fetchTalentpoolData();
  }, []);

  const fetchTalentpoolData = async () => {
    try {
      const response = await axios.get('http://localhost:3004/talent');
      setUploadedData(response.data);
    } catch (error) {
      console.error('Error fetching talent pool data:', error);
    }
  };

  const initialColumns = [
    { field: 'UID', headerName: 'UID', width: 100 },
    { field: 'Employee Name', headerName: 'Employee Name', width: 150 },
    { field: 'Band', headerName: 'Band', width: 100 },
    { field: 'UST Joining Date', headerName: 'UST Joining Date', width: 150 },
    { field: 'City', headerName: 'City', width: 100 },
    { field: 'TP Start Date', headerName: 'TP Start Date', width: 150 },
    { field: 'TP Status', headerName: 'TP Status', width: 150 },
    { field: 'Cost $/Day', headerName: 'Cost $/Day', width: 100 },
    { field: 'CTC (LPA)', headerName: 'CTC (LPA)', width: 100 },
    { field: 'Total Years Of experience', headerName: 'Total Years Of experience', width: 200 },
    { field: 'Skill Group', headerName: 'Skill Group', width: 150 },
    { field: 'TP Comments', headerName: 'TP Comments', width: 200 },
    { field: 'Aging', headerName: 'Aging', width: 100 },
    { field: 'Contact Number', headerName: 'Contact Number', width: 150 },
    { field: 'Previous Account', headerName: 'Previous Account', width: 200 },
    { field: 'Previous Manager', headerName: 'Previous Manager', width: 200 },
    { field: 'POC', headerName: 'POC', width: 100 },
    { field: 'Opp 1- Account', headerName: 'Opp 1- Account', width: 150 },
    { field: 'Feedabck', headerName: 'Feedabck', width: 150 },
    { field: 'Opp 2- Account', headerName: 'Opp 2- Account', width: 150 },
    { field: 'Feedabck_1', headerName: 'Feedabck 1', width: 150 },
    { field: 'Opp 3- Account', headerName: 'Opp 3- Account', width: 150 },
    { field: 'Feedabck_2', headerName: 'Feedabck 2', width: 150 },
    { field: 'Opp 4- Account', headerName: 'Opp 4- Account', width: 150 },
    { field: 'Feedabck_3', headerName: 'Feedabck 3', width: 150 },
    {
      field: "Update",
      headerName: "Update",
      width: 150,
      renderCell: (params) => (
        <UpdateTalentpoolUserDetails
          id={params.row.UID}
          handleUpdate={fetchTalentpoolData} // Refresh the data after updating
        />
      ),
      cellClassName: 'stickyColumn',
      headerClassName: 'stickyColumn'
    },
  ];

  const rows = uploadedData.map((row, index) => ({
    id: index,
    ...row,
  }));

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom style={{ color: 'white' }}>
        Manage Talent Pool
      </Typography>
      <Box
        m="20px 0"
        height="600px"
        sx={{
          "& .MuiDataGrid-root": {
            border: "1px solid #0A2342",
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#081C34",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#061524",
            },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #0A2342",
            color: "white",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#0A2342",
            borderBottom: "1px solid #0A2342",
            color: "white",
            height: "70px",
            padding: "20px",
            "& .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "normal",
              lineHeight: "normal",
              textAlign: "center",
            },
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #0A2342",
            backgroundColor: "#0A2342",
            color: "white",
            borderRadius: "0 0 5px 5px",
            marginTop: "20px",
          },
          "& .MuiCheckbox-root": {
            color: `#0A2342  !important`,
          },
          "& .css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar": {
            color: "white !important",
          },
          "& .css-1hgjne-MuiButtonBase-root-MuiIconButton-root.Mui-disabled": {
            color: "grey !important",
          },
          "& .MuiDataGrid-cell .MuiDataGrid-cell--textLeft": {
            color: "white !important",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `white !important`,
          },
          "& .css-zz4ezo .MuiDataGrid-footerContainer": {
            borderRadius: "5px",
          },
          "& .MuiDataGrid-toolbarContainer button": {
            color: "white !important",
          },
          "& .MuiDataGrid-toolbarContainer": {
            backgroundColor: "#0A2342",
            color: "white !important",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "10px",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
            background: "#081C34",
            borderRadius: "10px",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover": {
            background: "#061524",
          },
          "& .stickyColumn": {
            position: 'sticky',
            left: 0,
            backgroundColor: "#0A2342",
            zIndex: 1, // Ensure it's above other rows
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={initialColumns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default ManageTalentPool;
