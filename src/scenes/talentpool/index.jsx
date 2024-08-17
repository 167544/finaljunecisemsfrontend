import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Paper } from "@mui/material";
import UploadTalentpool from "../../components/UploadTalentpool";
import BandGraphComponenttalentpool from "../../components/BarChartComponenttalentpool";
import PieChartTalentpoolComponent from "../../components/PieChartTalentpoolComponent";
import SkillGroupTable from "../../components/SkillGroupTable"; 
import LocationChartTalentpool from "../../components/LocationChartTalentpool";
import * as XLSX from 'xlsx';

const Talentpool = () => {
  const [bandData, setBandData] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [uploadedData, setUploadedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [activeResourceCount, setActiveResourceCount] = useState(0);
  const [servingNoticeCount, setServingNoticeCount] = useState(0);
  const [maternityLeaveCount, setMaternityLeaveCount] = useState(0);
  const [futureAllocationCount, setFutureAllocationCount] = useState(0);
  const [totalBillableResourceCount, setTotalBillableResourceCount] = useState(0);
  const [pieChartData, setPieChartData] = useState([]);


  useEffect(() => {
    let userRole = localStorage.getItem("UserRole");
    if (userRole === "SuperAdmin") {
      setIsSuperAdmin(true);
    }
    fetchTalentpoolData();
  }, []);

  const fetchTalentpoolData = async () => {
    try {
      const response = await axios.get('http://localhost:3004/talent');
      const data = response.data;
      setUploadedData(data);
      prepareBandData(data);
      calculateCounts(data);
      prepareSkillData(data);
      prepareLocationData(data);
      preparePieChartData(data);  // Call this function to prepare pie chart data
    } catch (error) {
      console.error('Error fetching talent pool data:', error);
    }
  };

  const prepareBandData = (data) => {
    const activeData = data.filter(item => {
      const tpStatus = item['TP Status'] ? item['TP Status'].trim().toLowerCase() : "";
      return tpStatus === 'serving notice' || tpStatus === 'active tp resource';
    });

    const bandCount = activeData.reduce((acc, item) => {
      const band = item.Band;
      acc[band] = (acc[band] || 0) + 1;
      return acc;
    }, {});

    const formattedData = Object.entries(bandCount)
      .map(([band, count]) => ({ band, count }))
      .sort((a, b) => b.count - a.count);

    setBandData(formattedData);
  };

  // const prepareSkillData = (data) => {
  //   const skillGroupCount = {};

  //   data.forEach(row => {
  //     const skillGroup = row['Skill Group'];

  //     if (typeof skillGroup === 'string') {
  //       skillGroup.split(',').forEach(skill => {
  //         const trimmedSkill = skill.trim();
  //         if (!skillGroupCount[trimmedSkill]) {
  //           skillGroupCount[trimmedSkill] = 0;
  //         }
  //         skillGroupCount[trimmedSkill]++;
  //       });
  //     }
  //   });

  //   const formattedData = Object.entries(skillGroupCount).map(([skillGroup, count]) => ({
  //     skillGroup,
  //     count,
  //   }));

  //   setSkillData(formattedData);
  // };

  const prepareSkillData = (data) => {
    // Filter data based on TP Status
    const filteredData = data.filter(item => {
      const tpStatus = item['TP Status'] ? item['TP Status'].trim().toLowerCase() : "";
      return tpStatus === 'serving notice' || tpStatus === 'active tp resource';
    });
  
    const skillGroupCount = {};
  
    filteredData.forEach(row => {
      const skillGroup = row['Skill Group'];
  
      if (typeof skillGroup === 'string') {
        skillGroup.split(',').forEach(skill => {
          const trimmedSkill = skill.trim();
          if (!skillGroupCount[trimmedSkill]) {
            skillGroupCount[trimmedSkill] = 0;
          }
          skillGroupCount[trimmedSkill]++;
        });
      }
    });
  
    const formattedData = Object.entries(skillGroupCount).map(([skillGroup, count]) => ({
      skillGroup,
      count,
    }));
  
    setSkillData(formattedData);
  };
  

  const prepareLocationData = (data) => {
    console.log("LLLLlocation",data.length)
    const activeData = data.filter(item => {
      const tpStatus = item['TP Status'] ? item['TP Status'].trim().toLowerCase() : "";
      return tpStatus === 'serving notice' || tpStatus === 'active tp resource';
    });
    console.log("LLLLlocation",activeData.length)
    const locationCount = activeData.reduce((acc, item) => {
      const city = item.City;
      const band = item.Band;
      if (city && band) {
        if (!acc[band]) {
          acc[band] = { band };
        }
        acc[band][city] = (acc[band][city] || 0) + 1;
      }
      return acc;
    }, {});

    const formattedLocationData = Object.values(locationCount);

    setLocationData(formattedLocationData);
  };

  const preparePieChartData = (data) => {
    const pieData = [
      { name: 'Active TP', value: data.filter(item => item['TP Status'] === 'Active TP Resource').length, color: '#0088FE' },
      { name: 'Serving Notice', value: data.filter(item => item['TP Status'] === 'Serving Notice').length, color: '#00C49F' },
      { name: 'Maternity Leave', value: data.filter(item => item['TP Status'] === 'Maternity Leave').length, color: '#FFBB28' },
      { name: 'To be Allocated', value: data.filter(item => item['TP Status'] === 'Future Allocation').length, color: '#FF8042' },
      { name: 'Exit', value: data.filter(item => item['TP Status'] === 'Exit').length, color: '#A28C88' },
      { name: 'CIS Allocated', value: data.filter(item => item['TP Status'] === 'CIS Allocated').length, color: '#1F78B4' },
    ];
    setPieChartData(pieData);
  };

  
  const calculateCounts = (data) => {
    const activeResources = data.filter(item => {
      const tpStatus = item['TP Status'] ? item['TP Status'].trim().toLowerCase() : "";
      return tpStatus === 'active tp resource';
    }).length;

    const servingNotice = data.filter(item => {
      const tpStatus = item['TP Status'] ? item['TP Status'].trim().toLowerCase() : "";
      return tpStatus === 'serving notice';
    }).length;

    const maternityLeave = data.filter(item => {
      const tpStatus = item['TP Status'] ? item['TP Status'].trim().toLowerCase() : "";
      return tpStatus === 'maternity leave';
    }).length;

    const futureAllocation = data.filter(item => {
      const tpStatus = item['TP Status'] ? item['TP Status'].trim().toLowerCase() : "";
      return tpStatus === 'future allocation';
    }).length;

    const totalActiveResources = activeResources + servingNotice;
    const totalBillable = totalActiveResources + maternityLeave + futureAllocation;

    setActiveResourceCount(totalActiveResources);
    setServingNoticeCount(servingNotice);
    setMaternityLeaveCount(maternityLeave);
    setFutureAllocationCount(futureAllocation);
    setTotalBillableResourceCount(totalBillable);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Invalid file type. Please upload an Excel or CSV file.");
        return;
      }

      setErrorMessage("");
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        await uploadDataToDb(jsonData);
        setUploadedData(jsonData);
        calculateCounts(jsonData);
        prepareSkillData(jsonData);
        prepareLocationData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const uploadDataToDb = async (data) => {
    try {
      setIsUploading(true);
      await axios.post("http://localhost:3004/talent", { data });
      setIsUploading(false);
      fetchTalentpoolData();
    } catch (error) {
      setIsUploading(false);
      console.error("Error storing data:", error);
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom style={{ color: 'white' }}>
        Talent Pool
      </Typography>
      {isSuperAdmin && (
        <Box mb="20px">
          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <Paper elevation={3} sx={tileStyle}>
          <Typography variant="h6" sx={tileHeaderStyle}>Active Resources</Typography>
          <Typography variant="h4" sx={tileCountStyle}>{activeResourceCount}</Typography>
        </Paper>
        <Paper elevation={3} sx={tileStyle}>
          <Typography variant="h6" sx={tileHeaderStyle}>Serving Notice</Typography>
          <Typography variant="h4" sx={tileCountStyle}>{servingNoticeCount}</Typography>
        </Paper>
        <Paper elevation={3} sx={tileStyle}>
          <Typography variant="h6" sx={tileHeaderStyle}>Maternity Leave</Typography>
          <Typography variant="h4" sx={tileCountStyle}>{maternityLeaveCount}</Typography>
        </Paper>
        <Paper elevation={3} sx={tileStyle}>
          <Typography variant="h6" sx={tileHeaderStyle}>Future Allocation</Typography>
          <Typography variant="h4" sx={tileCountStyle}>{futureAllocationCount}</Typography>
        </Paper>
        <Paper elevation={3} sx={tileStyle}>
          <Typography variant="h6" sx={tileHeaderStyle}>Total Billable Resource in TP</Typography>
          <Typography variant="h4" sx={tileCountStyle}>{totalBillableResourceCount}</Typography>
        </Paper>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <Paper elevation={3} sx={chartBoxStyle}>
          {bandData.length > 0 && <BandGraphComponenttalentpool bandData={bandData} />}
        </Paper>
        {/* <Paper elevation={3} sx={chartBoxStyle}>
          <PieChartTalentpoolComponent />
        </Paper> */}
        <Paper elevation={3} sx={chartBoxStyle}>
          <PieChartTalentpoolComponent data={pieChartData} />  {/* Pass pieChartData as prop */}
        </Paper>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <Paper elevation={3} sx={chartBoxStyle}>
          {locationData.length > 0 && <LocationChartTalentpool data={locationData} />}
        </Paper>
        <Paper elevation={3} sx={chartBoxStyle}>
          {skillData.length > 0 && <SkillGroupTable skillData={skillData} />}
        </Paper>

        

      </Box>
      <UploadTalentpool uploadedData={uploadedData} />
    </Box>
  );
};

const tileStyle = {
  backgroundColor: "#0A2342",
  color: "white",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  minWidth: "150px",
  flex: "1",
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
};

const tileHeaderStyle = {
  fontWeight: "bold",
  marginBottom: "10px",
};

const tileCountStyle = {
  fontSize: "2rem",
};

const chartBoxStyle = {
  backgroundColor: "#0A2342",
  color: "white",
  padding: "1rem",
  borderRadius: "10px",
  textAlign: "center",
  width: "100%",
};

export default Talentpool;
