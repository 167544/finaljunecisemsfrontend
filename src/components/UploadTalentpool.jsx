import React, { useEffect, useState } from "react";
import "./UploadExcel.css";
import { Spinner } from "reactstrap"; // Import Spinner from reactstrap
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";

const UploadTalentpool = ({ uploadedData, onUploadSuccess }) => {
  // useEffect(() => {
  //   if (!uploadedData || uploadedData.length === 0) return null;

  //   const sendDataToBackend = async () => {
  //     try {
  //       const response = await axios.post(
  //         "http://localhost:3004/uploadtalent",
  //         {
  //           data: uploadedData,
  //         }
  //       );
  //       // console.log(response.data);
  //       onUploadSuccess(response.data); // Optional: handle the success response
  //     } catch (error) {
  //       console.error("Error uploading data:", error);
  //     }
  //   };

  //   sendDataToBackend();
  // }, [uploadedData]);

  if (!uploadedData || uploadedData.length === 0) return null;
  
  const headers = Object.keys(uploadedData[0]);

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
    <div className="m-2" style={{ backgroundColor: "#f0f0f0", padding: "10px" }}>
      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
    </div>
  );
};

export default UploadTalentpool;
