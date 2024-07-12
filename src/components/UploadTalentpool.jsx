import React, { useEffect, useState } from "react";
import "./UploadExcel.css";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const UploadTalentpool = ({ uploadedData, onUploadSuccess }) => {

  useEffect(() => {
    
  }, [])

  if (!uploadedData || uploadedData.length === 0) return null;

  const headers = Object.keys(uploadedData[0]).filter(header => header !== '_id');

  const columns = headers.map((header) => ({
    field: header,
    headerName: header,
    width: 150,
  }));

  const rows = uploadedData.map((row, index) => ({
    id: index,
    ...row,
  }));


  
  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        className="text-light" 
        rows={rows}
        columns={columns}
        components={{
          Toolbar: GridToolbar,
        }}
        componentsProps={{
          toolbar: {
            style: { backgroundColor: "#0A6E7C" },
          },
        }}
        getRowId={(row) => row.id}
        
      />
    </div>
  );
};

export default UploadTalentpool;
