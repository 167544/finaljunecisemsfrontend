import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Tooltip } from "@mui/material"; // Import Tooltip from MUI

const UploadTalentpool = ({ uploadedData }) => {

  if (!uploadedData || uploadedData.length === 0) return null;

  const headers = Object.keys(uploadedData[0]).filter(header => header !== '_id');

  const columns = headers.map((header) => ({
    field: header,
    headerName: header,
    flex: 1,
  }));

  const rows = uploadedData.map((row, index) => ({
    id: index,
    ...row,
  }));

  return (
    <Box
      m="20px 0"
      height="400px" // Adjust height as needed
      sx={{
        "& .MuiDataGrid-root": {
          border: "1px solid #0A2342", // Add border to the DataGrid
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "1px solid #0A2342", // Add border to the cells
          color: "white", // Set cell font color to white
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#0A2342", // Set header background color
          borderBottom: "1px solid #0A2342", // Add border to the bottom of the header
          color: "white", // Set header font color to white
          height: "70px", // Increase header height
          padding: "20px", // Increase padding for larger header
          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "normal", // Ensure text wraps
            lineHeight: "normal", // Adjust line height for better wrapping
            textAlign: "center", // Center align header text
          },
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "1px solid #0A2342", // Add border to the top of the footer
          backgroundColor: "#0A2342", // Set footer background color
          color: "white", // Set footer font color to white
          borderRadius: "0 0 5px 5px",
          marginTop: "20px", // Add margin to the top
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
          color: `white !important`, // Set toolbar button text color to white
        },
        "& .css-zz4ezo .MuiDataGrid-footerContainer": {
          borderRadius: "5px",
        },
        "& .MuiDataGrid-toolbarContainer button": {
          color: "white !important", // Set toolbar button text color to white
        },
        "& .MuiDataGrid-toolbarContainer": {
          backgroundColor: "#0A2342", // Set toolbar background color
          color: "white !important", // Set toolbar text color to white
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        getRowId={(row) => row.id}
      />
    </Box>
  );
};

export default UploadTalentpool;
