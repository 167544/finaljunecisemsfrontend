import React, { useEffect, useState } from "react";
import UploadTalentpool from "../../components/UploadTalentpool";
import * as XLSX from 'xlsx'
import axios from "axios";
import { useDispatch } from "react-redux";
import { Box, Typography, Tooltip } from "@mui/material"; // For additional styling
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // Import DataGrid

const ScrollableCell = ({ value }) => {
  return (
    <Tooltip title={value} arrow>
      <Box
        sx={{
          maxHeight: "100px", // Adjust this height as needed
          overflowY: "auto",
          padding: "5px",
          "&::-webkit-scrollbar": {
            width: "3px", // Width of the scrollbar
            height: "3px", // Height of the scrollbar for horizontal scroll
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888", // Color of the scrollbar thumb
            borderRadius: "5px", // Roundness of the scrollbar thumb
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555", // Color of the scrollbar thumb on hover
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1", // Color of the scrollbar track
          },
          color: "white", // Set the font color to white
        }}
      >
        {value}
      </Box>
    </Tooltip>
  );
};

const Talentpool = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isDataUploaded, setIsDataUploaded] = useState(0);
  const [uploadedData, setUploadedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false); // State to track upload status
  const [data, setData] = useState([]); // State to store fetched data

  useEffect(() => {
    let superadmin = localStorage.getItem("UserRole");
    if (superadmin === "SuperAdmin") {
      setIsSuperAdmin(true);
    }

    fetchData(); // Fetch data when the component mounts  
  }, []);

  // Fetch data from the database
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3004/talent'); // Fetch data from the server
      setData(response.data); // Store fetched data in state
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Error fetching data');
    }
  };

  // Handle the file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Invalid file type. Please upload an Excel or CSV file."); // Set error message
        return; // Exit the function
      }

      setErrorMessage(""); // Clear any existing error message
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const uploadResponse = await uploadDataToDb(jsonData);

        console.log(`>>-------------->>>> | file: index.jsx:41 | handleFileChange | jsonData:`, jsonData);

        setUploadedData(jsonData); // Store the parsed data
        handleUploadSuccess(); // Call upload success handler
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const dispatch = useDispatch();
  const uploadDataToDb = async (data) => {
    console.log(`>>-------------->>>> | file: index.jsx:63 | uploadDataToDb | data:`, data);

    try {
      setIsUploading(true); // Set isUploading to true when starting upload
      await axios.post("http://localhost:3004/talent", { data });
      fetchData(); // Fetch data after upload is complete
      setIsUploading(false); // Set isUploading to false after upload is complete
    } catch (error) {
      setIsUploading(false); // Set isUploading to false if upload fails
      console.error("Error storing data:", error);
      // Handle error appropriately (e.g., show error message to user)
    }
  };

  // Handle the uploaded data status
  const handleUploadSuccess = () => {
    setIsDataUploaded(isDataUploaded + 1);
  };

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        Talent Pool
      </Typography>
      {isSuperAdmin && (
        <>
          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} /> {/* Added file input */}
          {errorMessage && <Typography color="error">{errorMessage}</Typography>} {/* Display error message if any */}
          <UploadTalentpool onUploadSuccess={handleUploadSuccess} uploadedData={data} /> {/* Pass uploaded data */}
        </>
      )}
      {uploadedData && (
        <UploadTalentpool uploadedData={uploadedData} /> // Render the DataGrid with the uploaded data
      )}
    </Box>
  );
};

export default Talentpool;
