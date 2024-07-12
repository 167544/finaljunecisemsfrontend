import React, { useEffect, useState } from "react";
import UploadTalentpool from "../../components/UploadTalentpool";
import * as XLSX from 'xlsx'
import axios from "axios";
import { useDispatch } from "react-redux";

// const  {setTalentPool}  = require('../actions');

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

        const uploadResponse = await uploadDataToDb(jsonData)

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
      // (setTalentPool(response1.data));
      // dispatch(setSelectedData(response1.data))
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
    <div>
         {isSuperAdmin && (
        <>
          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} /> {/* Added file input */}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message if any */}
          <UploadTalentpool onUploadSuccess={handleUploadSuccess} uploadedData={data} /> {/* Pass uploaded data */}
        </>
      )}


    </div>
  );
};

export default Talentpool;
