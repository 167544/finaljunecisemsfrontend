import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import UploadExcel from "../../components/UploadExcel";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DashboardData from "../../components/DashboardData";
import { DownloadOutlined } from '@mui/icons-material';
import BandGraph from "../../components/BandGraph";
import USTExp from "../../components/USTExp";
import PrimarySkills from "../global/PrimarySkills";
import TableRepresentation from "../../components/TableRepresentation";
import EmployeeStatusGraph from "../../components/EmployeeStatusGraph";
import AllocationPerGraph from "../../components/AllocationPerGraph";
import ResourceType from "../../components/ResourceType";



const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  // State for tracking data upload
  const [isDataUploaded, setIsDataUploaded] = useState(0);


  useEffect(() => {
    let superadmin = localStorage.getItem('UserRole');
    if(superadmin === "SuperAdmin"){
      setIsSuperAdmin(true)
    }



  }, [])





  // Handle the uploaded data
  const handleUploadSuccess = () => {
    setIsDataUploaded(isDataUploaded + 1);
  };




  return (

    <div>
      <div className=""  >

        {isSuperAdmin && <UploadExcel onUploadSuccess={handleUploadSuccess}  /> }
        



        <DashboardData isDataUploaded={isDataUploaded} />



      </div>









    </div>

  );
};

export default Dashboard;
