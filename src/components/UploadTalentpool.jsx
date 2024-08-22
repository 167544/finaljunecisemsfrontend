import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const UploadTalentpool = ({ uploadedData }) => {
  if (!uploadedData || uploadedData.length === 0) return null;

  // Filter the uploadedData to only include "Serving Notice" or "Active TP Resource"
  const filteredData = uploadedData.filter((row) => {
    const tpStatus = row["TP Status"] ? row["TP Status"].trim().toLowerCase() : "";
    return tpStatus === "serving notice" || tpStatus === "active tp resource";
  });

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
  ];

  const [columns, setColumns] = useState(initialColumns);

  const rows = filteredData.map((row, index) => ({
    id: index,
    ...row,
  }));

  const handleCellClick = (params) => {
    const clickedField = params.field;
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.field === clickedField
          ? { ...column, width: 400 }
          : { ...column, width: initialColumns.find(col => col.field === column.field).width }
      )
    );
  };

  return (
    <Box
      sx={{
        height: "600px",
        borderRadius: "10px",
        backgroundColor: "#0A2342",
        "& .MuiDataGrid-root": {
          border: "1px solid #0A2342",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "1px solid #0A2342",
          color: "white",
          fontSize: "16px",  // Set font size to 16px
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#0A2342",
          color: "white",
          height: "70px",
          padding: "20px",
          fontSize: "16px",  // Set font size to 16px
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
          marginTop: "20px",
          fontSize: "16px",  // Set font size to 16px
        },
        "& .MuiCheckbox-root": {
          color: `#0A2342  !important`,
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: "white !important",
        },
        "& .MuiDataGrid-toolbarContainer": {
          backgroundColor: "#0A2342",
          color: "white !important",
          fontSize: "16px",  // Set font size to 16px
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        getRowId={(row) => row.id}
        onCellClick={handleCellClick}
      />
    </Box>
  );
};

export default UploadTalentpool;
