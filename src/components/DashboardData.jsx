import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "../Assets/css/dashboardHover.css";
import { tokens } from "../theme";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import BandGraph from "./BandGraph";
import USTExp from "./USTExp";
import TableRepresentation from "./TableRepresentation";
import ResourceType from "./ResourceType";
import EmployeeStatusGraph from "./EmployeeStatusGraph";
import DashboardRepresentation from "./DashboardRepresentation";
import ManagerSelect from "../scenes/global/ManagerSelect";
import PrimarySkills from "../scenes/global/PrimarySkills";
import setdata from "../actions";
import setSelectedData from "../actions/setSetlecteddata";
import Category from "../scenes/global/Category";
import CategoryGraph from "./CategoryGraph";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MapRepresentation from "./MapRepresentation";
import ClientSelect from "../scenes/global/ClientSelect";

// Utility function
const convertToNumericDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const numericDate = Math.floor((date.getTime() / 1000 / 86400) + 25569);
  return numericDate;
};

function DashboardData(props) {
  const [isUser, setIsUser] = useState(false);
  const [isManagerSelectDisabled, setIsManagerSelectDisabled] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("");

  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const employeeSelected = useSelector((state) => state.selectedData);
  const [managerKey, setManagerKey] = useState(0);
  const [primarySkillsKey, setPrimarySkillsKey] = useState(0);
  const [categoryKey, setCategoryKey] = useState(0);

  const [resetManagerSelect, setResetManagerSelect] = useState(false);
  const [resetPrimarySelect, setPrimarySelect] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [activeEmployeeCount, setActiveEmployeeCount] = useState(0);
  const [resourceWithValidVisaCount, setResourceWithValidVisaCount] = useState(0);
  const [resourseExitEmployeesCount, setResourceExitEmployeesCount] = useState(0);
  const [newlyAddedEmployeesCount, setNewlyAddedEmployeesCount] = useState(0);
  const [showRepresentation, setShowRepresentation] = useState(true);
  const [selectedBoxName, setSelectedBoxName] = useState("");
  const [TotalemployeeData, setTotalEmployeeData] = useState(0);

  const [startDate, setStartDate] = useState({
    exit: false,
    newlyHire: false
  });
  const [endDate, setEndDate] = useState({
    exit: false,
    newlyHire: false
  });
  const [timeRange, setTimeRange] = useState({exit: "", newlyHire: ""})

  // const [newlyJoinedStartDate, setNewlyJoinedStartDate] = useState(null);
  // const [newlyJoinedEndDate, setNewlyJoinedEndDate] = useState(null);

  const [fromDateCode, setFromDateCode] = useState('');
  const [toDateCode, setToDateCode] = useState('');
  const [newlyJoinedFromDateCode, setNewlyJoinedFromDateCode] = useState('');
  const [newlyJoinedToDateCode, setNewlyJoinedToDateCode] = useState('');
  const [exitEmployeesInTimeFrame, setExitEmployeesInTimeFrame] = useState(0);
  const [newEmployeesInTimeFrame, setNewEmployeesInTimeFrame] = useState('');

  const handleClientSelect = (selectedClient) => {
    console.log("Selected client:", selectedClient.label); // Debug log
    
    // Ensure that `selectedClient` is set correctly
    setSelectedClient(selectedClient);
  
    // Perform the filtering
    const filtered = employeeData.filter(emp => {
      console.log(`Checking employee: ${emp.Client} === ${selectedClient.value}`);
      return emp.Client === selectedClient.value;
    });
    
    console.log("Filtered data:", filtered); // Debug log
  
    // Update the Redux store and component state
    dispatch(setSelectedData(filtered));
    setFilteredData(filtered);
  };
  
  

  useEffect(() => {
    let userRole = localStorage.getItem("UserRole");

    if (userRole && userRole === "User") {
      setIsUser(true);
    }

    if (userRole && userRole === "Admin") {
      setIsManagerSelectDisabled(true);
    }

    if (userRole && userRole === "SuperAdmin") {
      setIsSuperAdmin(true);
    }

    fetchClients(); // Fetch clients when the component mounts
  }, []);

  useEffect(() => {
    fetchData();
  }, [props.isDataUploaded, resetManagerSelect, resetPrimarySelect]);

  useEffect(() => {
    if (employeeSelected.length) {
      setEmployeeData(employeeSelected);
      setFilteredData(employeeSelected);
      updateEmployeeStats(employeeSelected);
    }
  }, [employeeSelected]);


  useEffect(() => {
    if (!startDate.exit && !startDate.newlyHire && !endDate.exit && !endDate.newlyHire ) {
      console.log(`Setting default count for exit and new hire`)
      setExitEmployeesInTimeFrame(resourseExitEmployeesCount);
      setNewEmployeesInTimeFrame(newlyAddedEmployeesCount)
      return;
    }

    console.log("Filtering based on start / end date", employeeData.length)

    let 
      startDateCodes = {
        exit: convertToNumericDate(startDate.exit),
        newlyHire: convertToNumericDate(startDate.newlyHire)
      },
      endDateCodes = {
        exit: convertToNumericDate(endDate.exit),
        newlyHire: convertToNumericDate(endDate.newlyHire)
      },
      timeFilteredExitEmployees,
      timeFilteredNewEmployees; 

    if (startDate.exit || endDate.exit) {
      timeFilteredExitEmployees = employeeData.filter(emp => {
        let startDateValidated = startDateCodes.exit ? (emp["Exit Date"] > startDateCodes.exit) : true;
        let endDateValidated = endDateCodes.exit ? (emp["Exit Date"] < endDateCodes.exit) : true;
        return startDateValidated && endDateValidated;
      })
    }

    if (startDate.newlyHire || endDate.newlyHire) {
      timeFilteredNewEmployees = employeeData.filter(emp => {
        let startDateValidated = startDateCodes.newlyHire ? (emp["Hire Date"] > startDateCodes.newlyHire) : true;
        let endDateValidated = endDateCodes.newlyHire ? (emp["Hire Date"] < endDateCodes.newlyHire) : true;
        return startDateValidated && endDateValidated;
      })
    }

    if (timeFilteredExitEmployees) setExitEmployeesInTimeFrame(timeFilteredExitEmployees.length);
    if (timeFilteredNewEmployees) setNewEmployeesInTimeFrame(timeFilteredNewEmployees.length);
  },[startDate, endDate, employeeData])



  const handleFromDateChange = (e) => {
    setStartDate(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
    setTimeRange(prevState => ({
      ...prevState,
      [e.target.name]: ""
    }));
  };

  const handleToDateChange = (e) => {
    setEndDate(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
    setTimeRange(prevState => ({
      ...prevState,
      [e.target.name]: ""
    }));
  }

  const handleTimeRangeChange = (e) => {
    let range = e.target.value

    const now = new Date(); // Current date and time
    let fromDate, toDate;

    toDate = new Date(now); // Copy of current date as the "to" date

    if (range === "1 month") {
      fromDate = new Date(now); // Create a copy of now
      fromDate.setMonth(fromDate.getMonth() - 1);
      console.log("1 month exit ############################");
    } else if (range === "3 months") {
      fromDate = new Date(now); // Create a copy of now
      fromDate.setMonth(fromDate.getMonth() - 3);
      console.log("3 months exit ############################");
    } else if (range === "6 months") {
      fromDate = new Date(now); // Create a copy of now
      fromDate.setMonth(fromDate.getMonth() - 6);
      console.log("6 months exit ############################");
    }

    setTimeRange(prevState => ({
      ...prevState,
      [e.target.name]: range
    }));
    setEndDate(prevState => ({
      ...prevState,
      [e.target.name]: toDate
    }));
    setStartDate(prevState => ({
      ...prevState,
      [e.target.name]: fromDate
    }));

  };





  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:3004/clients");
      const clientsData = response.data;
  
      // Set the clients for the dropdown
      setClients(clientsData);
  
      // Set the customer count based on the clients dropdown count
      setCustomerCount(clientsData.length); // This will reflect the count of unique clients in the dropdown
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };
  
  

  const fetchData = async () => {
    try {
      const username = localStorage.getItem("name");
      let data;

      if (localStorage.getItem("UserRole") === "Admin") {
        const response = await axios.get(`http://localhost:3004/getMangersOFEmployee/${username}`);
        data = response.data;
      } else {
        const response = await axios.get("http://localhost:3004/fetchdata");
        data = response.data;
      }

      dispatch(setdata(data));
      dispatch(setSelectedData(data));
      setTotalEmployeeData(data.length);
      updateEmployeeStats(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

const updateEmployeeStats = (data) => {
    const activeEmployees = data.filter(item => item["Employee Status"] === "Active");
    const customerIDs = [...new Set(data.map(item => item["Customer ID"]))];
    const UniqueClients = [...new Set(data.map(item => item["Client"]))];
    const resourcesWithValidVisa = data.filter(item => item["Resource with Valid VISA"]);
    const resourceExitEmployees = data.filter(item => item["Employee Status"] === "Exit");

    setActiveEmployeeCount(activeEmployees.length);
    // console.log("*********data for client",data)
    setCustomerCount(UniqueClients.length);
    setResourceWithValidVisaCount(resourcesWithValidVisa.length);
    setResourceExitEmployeesCount(resourceExitEmployees.length);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sixMonthsAgoDigit = convertToNumericDate(sixMonthsAgo);

    const newlyAddedEmployees = data.filter(item => {
      const hireDate = item["Hire Date"];
      return parseInt(hireDate, 10) > parseInt(sixMonthsAgoDigit, 10);
    });

    setNewlyAddedEmployeesCount(newlyAddedEmployees.length);
  };

  const filterByTimeRange = useCallback((range) => {
    const now = new Date(); // Current date and time
    let fromDate, toDate;

    toDate = new Date(now); // Copy of current date as the "to" date

    if (range === "1 month") {
      fromDate = new Date(now); // Create a copy of now
      fromDate.setMonth(fromDate.getMonth() - 1);
      console.log("1 month exit ############################");
    } else if (range === "3 months") {
      fromDate = new Date(now); // Create a copy of now
      fromDate.setMonth(fromDate.getMonth() - 3);
      console.log("3 months exit ############################");
    } else if (range === "6 months") {
      fromDate = new Date(now); // Create a copy of now
      fromDate.setMonth(fromDate.getMonth() - 6);
      console.log("6 months exit ############################");
    }


    // const now = new Date();
    // let fromDate, toDate;

    // toDate = now; // Current date as the "to" date

    // if (range === "1 month") {
    //   fromDate = new Date(now.setMonth(now.getMonth() - 1));
    //   console.log("1 month exit ############################");
    // } else if (range === "3 months") {
    //   fromDate = new Date(now.setMonth(now.getMonth() - 3));
    //   console.log("3 months exit ############################");
    // } else if (range === "6 months") {
    //   fromDate = new Date(now.setMonth(now.getMonth() - 6));
    //   console.log("6 months exit ############################");
    // }

    const fromDateCode = convertToNumericDate(fromDate);
    const toDateCode = convertToNumericDate(toDate);
    console.log("from date ",fromDateCode)
    console.log("to date ",toDateCode)
    console.log("to  ",toDate)
    console.log("from  ",fromDate)


    setFromDateCode(fromDateCode);
    setToDateCode(toDateCode);

    fetchDataByDates(fromDateCode, toDateCode);
  }, [employeeData]);

  const handleBoxClick = useCallback((boxName) => {
    let data = [];
    switch(boxName) {
      case "Resources with Valid Visa":
        data = employeeData.filter(item => item["Resource with Valid VISA"]);
        break;
      case "Active Employee Count":
        data = employeeData.filter(item => item["Employee Status"] === "Active");
        break;
      case "Exit":
        console.log("$$$$$$",selectedTimeRange);
        if (selectedTimeRange) {
          filterByTimeRange(selectedTimeRange);
         // data = employeeData.filter(item => item["Employee Status"] === "Exit");
          return;
        } else {
          data = employeeData.filter(item => item["Employee Status"] === "Exit");
        }
        break;
      default:
        data = employeeData;
    }
    setFilteredData(data);
    setSelectedBoxName(boxName);
  }, [employeeData, selectedTimeRange, filterByTimeRange]);

  const handlePrimarySelect = (boxName) => {
    setSelectedBoxName(boxName + "skills");
    setSelectedData(boxName);
  };

  const handleManagerSelect = (boxName) => {
    setSelectedBoxName(boxName + "manager");
    setShowRepresentation(true);
  };

  const handleCategory = (boxName) => {
    setSelectedBoxName(boxName + "category");
    setShowRepresentation(true);
  };


  const handleUSTExpFilter = (filteredData) => {
    setFilteredData(filteredData);
  };

  const resetSelectComponent = () => {
    setResetManagerSelect(prevState => !prevState);
    setPrimarySelect(prevState => !prevState);
    setManagerKey(prevKey => prevKey + 1);
    setPrimarySkillsKey(prevKey => prevKey + 1);
    setCategoryKey(prevKey => prevKey + 1);
    setSelectedTimeRange(""); // Reset the selected time range
    setSelectedBoxName("");
    setFilteredData(employeeData); // Reset to show all data
    setStartDate({
      exit: false,
      newlyHire: false
    })
    setEndDate({
      exit: false,
      newlyHire: false
    })
    setTimeRange({exit: "", newlyHire: ""})
  };

  const fetchDataByDates = async () => {
    if (!fromDateCode || !toDateCode) return;

    try {
      console.log('((((((((',fromDateCode,toDateCode);
      const response = await axios.get("http://localhost:3004/fetchbydate", {

        params: { fromDate: fromDateCode, toDate: toDateCode }
      });
      console.log("$$$$$$$$$$$$$$$$$$",response.data);
      dispatch(setdata(response.data));
      dispatch(setSelectedData(response.data));
      setEmployeeData(response.data);
      setFilteredData(response.data);
      updateEmployeeStats(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const boxes = [
    { title: "Total Employees", value: employeeData.length - resourseExitEmployeesCount, color: "#0A2342" },
    { title: "Total Clients", value: customerCount, color: "#0A2342" },
    { title: "Active Employee Count", value: activeEmployeeCount, color: "#0A2342" },
    { title: "Resources with Valid Visa", value: resourceWithValidVisaCount, color: "#0A2342" },
  ];

  const boxesWithIndependentDateFilter = [
    { key: "exit", title: "Attrition", value: exitEmployeesInTimeFrame, color: "#0A2342" },
    { key: "newlyHire", title: "Newly Joined Employees", value: newEmployeesInTimeFrame, color: "#0A2342" },
  ]

  return (
    <>
      <span style={{ display: "inline-block", marginBottom: "1rem", width: "100%" }} className="container-fluid">
        <div style={{ width: "100%" }}>
          <div className="container-fluid d-flex">
            {isUser ? null : (
              <>
                {!(isManagerSelectDisabled || isSuperAdmin) ? null : (
                  <ManagerSelect key={managerKey} handleBoxClick={handleManagerSelect} />
                )}
                <ClientSelect handleClientSelect={handleClientSelect} />
                <Category handleBoxClick={handleCategory} />
                <PrimarySkills handleBoxClick={handlePrimarySelect} />
                <button
                  style={{
                    height: "35px",
                    width: "70px",
                    margin: "5px",
                    cursor: "pointer",
                    border: "2px solid #ffffff",
                    backgroundColor: "transparent",
                    color: "#ffffff",
                  }}
                  variant="contained"
                  color="primary"
                  onClick={resetSelectComponent}
                >
                  Reset
                </button>
              </>
            )}
            <div className="d-flex" style={{ display: "flex", marginLeft: "auto " }}>
              <div className="me-1" style={{ minHeight: "50px", fontFamily: "Inter, serif", color: "#ffffff" }}>
                <h1 style={{ fontSize: "1.5rem", textAlign: "center", padding: "0.5rem", fontWeight: "bold" }}>
                  Total Employee Count: {TotalemployeeData - resourseExitEmployeesCount}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </span>

      <div>
        <div style={{ margin: "1rem" }}>
          <div className="d-flex justify-content-center" style={{ display: "flex", justifyContent: "start", gap: "1rem", flexWrap: "wrap" }}>
            <div className="mb-5 flex-wrap" style={{ display: "flex", backgroundColor: "transparent" }}>
              {boxes.map((box, index) => (
                <div
                  key={index}
                  className={`box-hover ${box.title !== "Attrition" ? "box-gap" : ""}`}
                  style={{
                    width: "200px",
                    padding: "0.5rem",
                    borderRadius: "15px",
                    backgroundColor: `${box.color}`,
                    textAlign: "center",
                    cursor: "pointer",
                    margin: "0.5rem",
                    boxShadow: "1px 5px 5px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                  onClick={() => handleBoxClick(box.title)}
                >
                  <h4 style={{ fontSize: "1rem", fontWeight: "bold", fontFamily: "Inter, serif", color: "white" }}>
                    {box.title}
                  </h4>
                  <p style={{ color: "white", fontSize: "2rem" }}>{box.value}</p>
                </div>
              ))}

              {
                boxesWithIndependentDateFilter.map((box, index) => (
                  <div
                  key={index}
                  className={`box-hover ${box.title !== "Attrition" ? "box-gap" : ""}`}
                  style={{
                    width: "200px",
                    padding: "0.5rem",
                    borderRadius: "15px",
                    backgroundColor: `${box.color}`,
                    textAlign: "center",
                    cursor: "pointer",
                    margin: "0.5rem",
                    boxShadow: "1px 5px 5px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <h4 style={{ fontSize: "1rem", fontWeight: "bold", fontFamily: "Inter, serif", color: "white" }}>
                    {box.title}
                  </h4>
                  <p style={{ color: "white", fontSize: "2rem" }}>{box.value}</p>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <style>
                      {`
                        input[type="date"]::-webkit-calendar-picker-indicator {
                          filter: invert(1);
                        }
                      `}
                    </style>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: "white", fontSize: "0.8rem" }}>From:</span>
                      <input
                        type="date"
                        value={startDate[box.key]}
                        name={box.key}
                        onChange={handleFromDateChange}
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          color: "white",
                          fontSize: "0.8rem",
                          padding: "0.2rem",
                        }}
                        disabled={selectedTimeRange !== ""}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: "white", fontSize: "0.8rem" }}>To:</span>
                      <input
                        type="date"
                        name={box.key}
                        value={endDate[box.key]}
                        // name="toDate"
                        onChange={handleToDateChange}
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          color: "white",
                          fontSize: "0.8rem",
                          padding: "0.2rem",
                        }}
                        disabled={selectedTimeRange !== ""}
                      />
                    </div>
                    <select
                      value={timeRange[box.key]}
                      name={box.key}
                      onChange={handleTimeRangeChange}
                      style={{
                        height: "35px",
                        width: "150px",
                        margin: "5px",
                        border: "2px solid #ffffff",
                        backgroundColor: "transparent",
                        color: "#ffffff",
                      }}
                    >
                      <option value="">Select Time Range</option>
                      <option value="1 month">1 Month</option>
                      <option value="3 months">3 Months</option>
                      <option value="6 months">6 Months</option>
                    </select>
                  </div>
                </div>

                ))
              }


            </div>
          </div>
          <div className="d-flex" style={{ marginTop: "1rem", gap: "1rem", flexWrap: "wrap", justifyContent: "flex-start" }}>
            
             <div style={{ flex: "1 1 20%", maxWidth: "20%", textAlign: "center", padding: "1rem", marginLeft: "2.5rem" }}>
              <ResourceType columnname="Resource Type" data={filteredData} />
            </div>
            <div style={{ flex: "1 1 20%", maxWidth: "20%", textAlign: "center", padding: "1rem", marginLeft: "3.5rem" }}>
              <USTExp Empdata={filteredData} onFilter={handleUSTExpFilter} />
            </div>
           
            <div style={{ flex: "1 1 20%", maxWidth: "20%", textAlign: "center", padding: "1rem", marginLeft: "2.5rem" }}>
              <EmployeeStatusGraph data={filteredData} columnname="Employee Status" /> {/* Swapped position */}
            </div>
            <div style={{ flex: "1 1 20%", maxWidth: "10%", textAlign: "center", padding: "1rem", marginLeft: "2.5rem" }}>
              <CategoryGraph columnname="Country" data={filteredData} />
            </div>
          </div>
          <div className="d-flex" style={{ marginTop: "3rem", gap: "2rem", flexWrap: "wrap", justifyContent: "flex-start" }}>
            <div className="row w-100">
              <div className="col-md-6" style={{ paddingRight: '2rem', height: '550px', gap: "1rem", }}>
                <MapRepresentation columnname="Country" data={filteredData} />
              </div>
              <div className="col-md-6" style={{ paddingLeft: '20rem', gap: "2rem", }}>
                <BandGraph data={filteredData} /> {/* Swapped position */}
              </div>
            </div>
          </div>

          {isUser ? null : (
            <>
              {showRepresentation && (
                <DashboardRepresentation data={selectedBoxName} style={{ width: "40%" }} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardData;
