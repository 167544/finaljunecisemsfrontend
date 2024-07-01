import React, { useEffect, useState } from "react";
import UploadTalentpool from "../../components/UploadTalentpool";
import * as XLSX from 'xlsx'

const Talentpool = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isDataUploaded, setIsDataUploaded] = useState(0);
  const [uploadedData, setUploadedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let superadmin = localStorage.getItem("UserRole");
    if (superadmin === "SuperAdmin") {
      setIsSuperAdmin(true);
    }
  }, []);

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
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setUploadedData(jsonData); // Store the parsed data
        handleUploadSuccess(); // Call upload success handler
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Handle the uploaded data status
  const handleUploadSuccess = () => {
    setIsDataUploaded(isDataUploaded + 1);
  };

  return (
    <div className="m-2 py-3">
      {/* The upload file button here */}
         {isSuperAdmin && (
        <>
          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} /> {/* Added file input */}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message if any */}
          <UploadTalentpool onUploadSuccess={handleUploadSuccess} uploadedData={uploadedData} /> {/* Pass uploaded data */}
        </>
      )}
    </div>
  );
};

export default Talentpool;
