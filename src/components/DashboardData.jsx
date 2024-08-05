import React, { useEffect, useState } from "react";
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
  const [customerCount, setCustomerCount] = useState(0);
  const [activeEmployeeCount, setActiveEmployeeCount] = useState(0);
  const [resourceWithValidVisaCount, setResourceWithValidVisaCount] = useState(0);
  const [resourseExitEmployeesCount, setResourceExitEmployeesCount] = useState(0);
  const [newlyAddedEmployeesCount, setNewlyAddedEmployeesCount] = useState(0);
  const [showRepresentation, setShowRepresentation] = useState(true);
  const [selectedBoxName, setSelectedBoxName] = useState("");
  const [TotalemployeeData, setTotalEmployeeData] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [fromDateCode, setFromDateCode] = useState('');
  const [toDateCode, setToDateCode] = useState('');

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
  }, []);

  useEffect(() => {
    fetchData();
  }, [props.isDataUploaded, resetManagerSelect, resetPrimarySelect]);

  useEffect(() => {
    if (employeeSelected.length) {
      setEmployeeData(employeeSelected);
      updateEmployeeStats(employeeSelected);
    }
  }, [employeeSelected]);

  const updateEmployeeStats = (data) => {
    const activeEmployees = data.filter(item => item["Employee Status"] === "Active");
    const customerIDs = [...new Set(data.map(item => item["Customer ID"]))];
    const resourcesWithValidVisa = data.filter(item => item["Resource with Valid VISA"]);
    const resourceExitEmployees = data.filter(item => item["Employee Status"] === "Exit");

    setActiveEmployeeCount(activeEmployees.length);
    setCustomerCount(customerIDs.length);
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

  const handleBoxClick = (boxName) => {
    setSelectedBoxName(boxName);
    setSelectedData(boxName);
  };

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

  const resetSelectComponent = () => {
    setResetManagerSelect(prevState => !prevState);
    setPrimarySelect(prevState => !prevState);
    setManagerKey(prevKey => prevKey + 1);
    setPrimarySkillsKey(prevKey => prevKey + 1);
    setCategoryKey(prevKey => prevKey + 1);
    setSelectedBoxName("");
  };

  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    setStartDate(newFromDate);
    const numericDate = convertToNumericDate(newFromDate);
    setFromDateCode(numericDate);
  };

  const handleToDateChange = (e) => {
    const newToDate = e.target.value;
    setEndDate(newToDate);
    const numericDate = convertToNumericDate(newToDate);
    setToDateCode(numericDate);
  };

  const handleFetchByDates = () => {
    if (fromDateCode && toDateCode) {
      fetchDataByDates();
      console.log('Testing fetch data by dates : ', fetchDataByDates)
    } else {
      alert("Please select both 'From' and 'To' dates.");
    }
  };

  const fetchDataByDates = async () => {
    if (!fromDateCode || !toDateCode) return;

    try {
      const response = await axios.get("http://localhost:3004/fetchbydate", {
        params: { fromDate: fromDateCode, toDate: toDateCode }
      });
      dispatch(setdata(response.data));
      dispatch(setSelectedData(response.data));
      setEmployeeData(response.data);
      updateEmployeeStats(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const boxes = [
    { title: "Total Employees", value: employeeData.length-resourseExitEmployeesCount, color: "#0A2342" },
    { title: "Total Customers", value: customerCount, color: "#0A2342" },
    { title: "Active Employee Count", value: activeEmployeeCount, color: "#0A2342" },
    { title: "Resources with Valid Visa", value: resourceWithValidVisaCount, color: "#0A2342" },
    { title: "Exit", value: resourseExitEmployeesCount, color: "#0A2342" },
    { title: "Newly Joined Employees", value: newlyAddedEmployeesCount, color: "#0A2342" },
  ];

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
                  Total Employee Count: {TotalemployeeData-resourseExitEmployeesCount}
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
                  className={`box-hover ${box.title !== "Exit" ? "box-gap" : ""}`}
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

                  {box.title === "Exit" ? (
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
                          name="fromDate"
                          onChange={handleFromDateChange}
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                            color: "white",
                            fontSize: "0.8rem",
                            padding: "0.2rem",
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ color: "white", fontSize: "0.8rem" }}>To:</span>
                        <input
                          type="date"
                          name="toDate"
                          onChange={handleToDateChange}
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                            color: "white",
                            fontSize: "0.8rem",
                            padding: "0.2rem",
                          }}
                        />
                      </div>
                      <div>
                        <button
                          onClick={handleFetchByDates}
                          style={{
                            backgroundColor: "#0A6E7C",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Go
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex" style={{ marginTop: "1rem", gap: "1rem", flexWrap: "wrap", justifyContent: "flex-start" }}>
            <div style={{ flex: "1 1 20%", maxWidth: "20%", textAlign: "center", padding: "1rem" }}>
              <BandGraph isDataUploaded={props.isDataUploaded} />
            </div>
            <div style={{ flex: "1 1 20%", maxWidth: "20%", textAlign: "center", padding: "1rem", marginLeft: "4rem" }}>
              <USTExp isDataUploaded={props.isDataUploaded} />
            </div>
            <div style={{ flex: "1 1 20%", maxWidth: "20%", textAlign: "center", padding: "1rem", marginLeft: "2.5rem" }}>
              <ResourceType columnname="Resource Type" isDataUploaded={props.isDataUploaded} />
            </div>
            <div style={{ flex: "1 1 20%", maxWidth: "10%", textAlign: "center", padding: "1rem", marginLeft: "5.4rem" }}>
              <CategoryGraph columnname="Country" isDataUploaded={props.isDataUploaded} />
            </div>
          </div>
          <div className="d-flex" style={{ marginTop: "3rem", gap: "2rem", flexWrap: "wrap", justifyContent: "flex-start" }}>
          <div className="row w-100">
  <div className="col-md-6" style={{ paddingRight: '2rem', height: '500px', gap: "1rem", }}>
    <MapRepresentation columnname="Country" isDataUploaded={props.isDataUploaded} />
  </div>
  <div className="col-md-6" style={{ paddingLeft: '20rem', gap: "2rem", }}>
    <EmployeeStatusGraph columnname="Employee Status" isDataUploaded={props.isDataUploaded} />
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
