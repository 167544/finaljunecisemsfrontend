import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import setdata from './../actions/index';
import axios from 'axios';
import './UploadExcel.css';
import setSelectedData from '../actions/setSetlecteddata';
import { Spinner } from 'reactstrap';

function UploadExcel({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false); // State to track upload status
  const dispatch = useDispatch();

  const storeDataINDb = async (newData) => {
    try {
      setIsUploading(true); // Set isUploading to true when starting upload

      // Fetch existing data from the database
      const existingDataResponse = await axios.get('http://localhost:3004/fetchdata');
      const existingData = existingDataResponse.data;

      // Filter out data that already exists in the application (by unique identifier)
      const filteredData = newData.filter((newItem) => {
        return !existingData.some(existingItem => {
          return JSON.stringify(existingItem) === JSON.stringify(newItem);
        });
      });

      if (filteredData.length > 0) {
        // Save only the new data to the database
        await axios.post("http://localhost:3004/employeedata", filteredData);
      }

      // Fetch updated data from the database after adding new records
      const updatedDataResponse = await axios.get('http://localhost:3004/fetchdata');
      dispatch(setdata(updatedDataResponse.data));
      dispatch(setSelectedData(updatedDataResponse.data));

      setIsUploading(false); // Set isUploading to false after upload is complete
      onUploadSuccess(); // Call success callback
    } catch (error) {
      setIsUploading(false); // Set isUploading to false if upload fails
      console.error("Error storing data:", error);
      // Handle error appropriately (e.g., show error message to user)
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0]; // Assuming you want the first sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const formattedData = formatData(jsonData); // Format data into desired format

      try {
        await storeDataINDb(formattedData); // Sending formatted data to the backend
      } catch (error) {
        console.error("Error processing upload:", error);
        // Handle error appropriately (e.g., show error message to user)
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Function to format the data into individual JSON objects
  const formatData = (data) => {
    const fieldNames = data[0]; // First row contains field names
    const formattedData = data.slice(1).map((row) => {
      const formattedRow = {};
      for (let i = 0; i < fieldNames.length; i++) {
        formattedRow[fieldNames[i]] = row[i];
      }
      return formattedRow;
    });
    return formattedData;
  };

  return (
    <div style={{ maxWidth: '250px', display: "inline-block" }} className='text-light'>
      <div className='d-flex'>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileUpload}
          style={{
            width: "200px",
            padding: "10px",
            margin: "1rem",
            boxShadow: "1px 4px 5px #0A6E7C",
            borderRadius: "5px",
            border: "none"
          }}
        />
        {isUploading && ( // Display spinner if isUploading is true
          <div className="spinner d-inline-block">
            <Spinner color="primary" />
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadExcel;
