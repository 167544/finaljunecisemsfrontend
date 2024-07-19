import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const UploadTalentpool = ({ uploadedData }) => {
  if (!uploadedData || uploadedData.length === 0) return null;

  const initialColumns = [
    { field: 'UID', headerName: 'UID', width: 100 },
    { field: 'Employee Name', headerName: 'Employee Name', width: 150 },
    { field: 'TP_TICL Start Date', headerName: 'TP_TICL Start Date', width: 150 },
    { field: 'Strt Month', headerName: 'Strt Month', width: 100 },
    { field: 'Band', headerName: 'Band', width: 100 },
    { field: 'City', headerName: 'City', width: 100 },
    { field: 'CIS Remarks', headerName: 'CIS Remarks', width: 150 },
    { field: 'Status Summary', headerName: 'Status Summary', width: 150 },
    { field: 'Skill Group', headerName: 'Skill Group', width: 150 },
    { field: 'Aging', headerName: 'Aging', width: 100 },
    { field: 'Resource CTC (LPA)', headerName: 'Resource CTC (LPA)', width: 150 },
    { field: 'Opp 1', headerName: 'Opp 1', width: 150 },
    { field: 'Result', headerName: 'Result', width: 100 },
    { field: 'Opp 2', headerName: 'Opp 2', width: 150 },
    { field: 'Result_1', headerName: 'Result 1', width: 100 },
    { field: 'Contact Number', headerName: 'Contact Number', width: 150 },
    { field: 'Previous Account', headerName: 'Previous Account', width: 150 },
    { field: 'Previous Manager', headerName: 'Previous Manager', width: 150 },
    { field: 'Ready for relocation', headerName: 'Ready for relocation', width: 150 },
    { field: 'Ready for Nyt Shift', headerName: 'Ready for Nyt Shift', width: 150 },
    { field: 'Primary Skill', headerName: 'Primary Skill', width: 150 },
  ];

  const [columns, setColumns] = useState(initialColumns);

  const rows = uploadedData.map((row, index) => ({
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
      m="20px 0"
      height="400px"
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
