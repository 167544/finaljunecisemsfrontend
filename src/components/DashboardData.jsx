import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "../Assets/css/dashboardHover.css";

import { tokens } from "../theme";
import { useDispatch } from "react-redux";
import axios from "axios";
import BandGraph from "./BandGraph";
import USTExp from "./USTExp";
import TableRepresentation from "./TableRepresentation";
import ResourceType from "./ResourceType";
import EmployeeStatusGraph from "./EmployeeStatusGraph";
import AllocationPerGraph from "./AllocationPerGraph";
import DashboardRepresentation from "./DashboardRepresentation";
import ManagerSelect from "../scenes/global/ManagerSelect";
import PrimarySkills from "../scenes/global/PrimarySkills";
import setdata from "../actions";
import setSelectedData from "../actions/setSetlecteddata";
import Category from "../scenes/global/Category";
import { useSelector } from "react-redux";
import CategoryGraph from "./CategoryGraph";

// Import Material-UI Icons
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

function DashboardData(props) {
  const [isUser, setIsUser] = useState(false);
  const [isManagerSelectDisabled, setIsManagerSelectDisabled] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const employeeSelected = useSelector((state) => state.selectedData);
  const [managerFilter, setManagerFilter] = useState("");
  const [managerKey, setManagerKey] = useState(0); // Key to force reload ManagerSelect
  const [primarySkillsKey, setPrimarySkillsKey] = useState(0); // Key for PrimarySkills component
  const [categoryKey, setCategoryKey] = useState(0);

  const [resetManagerSelect, setResetManagerSelect] = useState(false); // State variable for reset action4
  const [resetPrimarySelect, setPrimarySelect] = useState(false);
  const [employeeData, setEmployeeData] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [activeEmployeeCount, setActiveEmployeeCount] = useState(0);
  const [resourceWithValidVisaCount, setResourceWithValidVisaCount] = useState(
    0
  );
  const [resourseExitEmployeesCount, setResourceExitEmployeesCount] =
    useState(0); //CodeByJ - state to find exit count
  const [newlyAddedEmployeesCount, setNewlyAddedEmployeesCount] = useState(0); //CodeByJ - state to find newly added employees
  const [showRepresentation, setShowRepresentation] = useState(true);
  const [selectedBoxName, setSelectedBoxName] = useState("");
  const [TotalemployeeData, setTotalEmployeeData] = useState(0);
  const [startDate, setStartDate] = useState(null);//vj
  const [endDate, setEndDate] = useState(null);//vj

  // New state to store the 5-digit numeric codes
  const [fromDateCode, setFromDateCode] = useState('');
  const [toDateCode, setToDateCode] = useState('')

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
  }, [props.isDataUploaded, resetManagerSelect, resetPrimarySelect]); // Include resetManagerSelect in dependency array

  useEffect(() => {
    setEmployeeData(employeeSelected);
    activeEmp();
  }, [employeeSelected]);

  const activeEmp = () => {
    let empActive = employeeSelected.filter(
      (item) => item["Employee Status"] === "Active"
    );

    let empwithCustomer = [
      ...new Set(employeeSelected.map((item) => item["Customer ID"])),
    ];
    setCustomerCount(empwithCustomer.length);
    let empwithValidVisa = employeeSelected.filter(
      (item) => item["Resource with Valid VISA"]
    );
    setActiveEmployeeCount(empActive.length);
    setResourceWithValidVisaCount(empwithValidVisa.length);

    //CodyByJ - below code
    let empwithExit = employeeSelected.filter(
      (item) => item["Resource Type"] === "Exit"
    );
    setResourceExitEmployeesCount(empwithExit.length);
  };

  const fetchData = async () => {
    try {
      const username = localStorage.getItem("name");
      console.log(username);

      let data;
      if (localStorage.getItem("UserRole") === "Admin") {
        const response = await axios.get(
          `http://localhost:3004/getMangersOFEmployee/${username}`
        );
        dispatch(setdata(response.data));
        dispatch(setSelectedData(response.data));
        data = response.data;
      } else {
        const response = await axios.get("http://localhost:3004/fetchdata");
        dispatch(setdata(response.data));
        dispatch(setSelectedData(response.data));
        data = response.data;
      }

      setTotalEmployeeData(data.length);

      setEmployeeData(employeeSelected);
      const datac = data.map((item) => item["Customer ID"]);
      const customerIDs = [...new Set(data.map((item) => item["Customer ID"]))];
      setCustomerCount(customerIDs.length);

      const activeEmployees = employeeData.filter(
        (item) => item["Employee Status"] === "Active"
      );
      setActiveEmployeeCount(activeEmployees.length);

      const resourcesWithValidVisa = employeeData.filter(
        (item) => item["Resource with Valid VISA"]
      );
      setResourceWithValidVisaCount(resourcesWithValidVisa.length);

      //CodeByJ - below
      const resourceExitEmployees = employeeData.filter(
        (item) => item["Resource Type"] === "Exit"
      );
      setResourceExitEmployeesCount(resourceExitEmployees);

      //CodeByJ - to find newly added emps. Calculate no of emp's Hire date less than one month from Date().
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const newlyAddedEmployees = employeeData.filter((item) => {
        const hireDate = new Date(item["Hire Date"]);
        return hireDate > oneMonthAgo;
      });
      // console.log("new ones: ", newlyAddedEmployees)
      const newEmployeesCount = newlyAddedEmployees.length;
      setNewlyAddedEmployeesCount(newEmployeesCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBoxClick = (boxName) => {
    setSelectedBoxName(boxName);
    setSelectedData(boxName); // Pass the data to setSelectedData action
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
    setResetManagerSelect((prevState) => !prevState); // Toggle state to trigger re-render for ManagerSelect
    setPrimarySelect((prevState) => !prevState); // Toggle state to trigger re-render for PrimarySkills
    setManagerKey((prevKey) => prevKey + 1); // Update key to force reload ManagerSelect

    setPrimarySkillsKey((prevKey) => prevKey + 1); // Update key to force reload PrimarySkills
    setCategoryKey((prevKey) => prevKey + 1); // Update key to force reload Category

    setSelectedBoxName("");
  };

  //New function to handle 'from' date change
  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    setStartDate(newFromDate); // Update startDate with the selected date
    const numericDate = convertToNumericDate(newFromDate); // Convert to 5-digit code
    setFromDateCode(numericDate); // Update state with 5-digit code
  };

  // New function to handle 'to' date change
  const handleToDateChange = (e) => {
    const newToDate = e.target.value;
    setEndDate(newToDate); // Update endDate with the selected date
    const numericDate = convertToNumericDate(newToDate); // Convert to 5-digit code
    setToDateCode(numericDate); // Update state with 5-digit code
  };

  const handleFetchByDates = () => {
    if (fromDateCode && toDateCode) { // Check if both dates are selected
        fetchDataByDates();
    } else {
        alert("Please select both 'From' and 'To' dates."); // Optional: Show an alert if dates are missing
    }
};

const fetchDataByDates = async () => {
  if (!fromDateCode || !toDateCode) return; // Check if both dates are set

  // console.log(fromDateCode+" to "+toDateCode)
  try {
      const response = await axios.get("http://localhost:3004/fetchbydate", {
          params: { fromDate: fromDateCode, toDate: toDateCode }
      });
      console.log(response)
      dispatch(setdata(response.data));
      dispatch(setSelectedData(response.data));
      setEmployeeData(response.data); 
    } catch (error) {
      console.error("Error fetching data:", error);
  }
};

const convertToNumericDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const numericDate = Math.floor((date.getTime() / 1000 / 86400) + 25569);
  return numericDate;
};

  const boxes = [
    { title: "Total Employees", value: employeeData.length, color: "#0A2342" },
    { title: "Total Customers", value: customerCount, color: "#0A2342" },
    {
      title: "Active Employee Count",
      value: activeEmployeeCount,
      color: "#0A2342",
    },
    {
      title: "Resources with Valid Visa",
      value: resourceWithValidVisaCount,
      color: "#0A2342",
    },
    { title: "Exit", value: resourseExitEmployeesCount, color: "#0A2342" },
    {
      title: "Newly Joined Employees",
      value: newlyAddedEmployeesCount,
      color: "#0A2342",
    },
  ];

  return (
    <>
      <span
        style={{ display: "inline-block", marginBottom: "1rem", width: "100%" }}
        className="container-fluid"
      >
        <div style={{ width: "100%" }}>
          <div className="container-fluid d-flex">
            {isUser ? null : (
              <>
                {!(isManagerSelectDisabled || isSuperAdmin) ? null : (
                  <ManagerSelect
                    key={managerKey}
                    handleBoxClick={handleManagerSelect}
                  />
                )}
                <Category handleBoxClick={handleCategory} />
                <PrimarySkills handleBoxClick={handlePrimarySelect} />
                <button
                  style={{
                    height: "35px",
                    width: "70px",
                    margin: "5px",
                    cursor: "pointer",
                    border: "2px solid #ffffff", // Adding border with primary color
                    backgroundColor: "transparent", // Transparent background to highlight the border
                    color: "#ffffff", // Matching text color with border
                  }}
                  variant="contained"
                  color="primary"
                  onClick={resetSelectComponent}
                >
                  Reset
                </button>
              </>
            )}
            <div
              className="d-flex"
              style={{ display: "flex", marginLeft: "auto " }}
            >
              <div
                className="me-1"
                style={{
                  minHeight: "50px",
                  fontFamily: "Inter, serif",
                  color: "#ffffff",
                }}
              >
                <h1
                  style={{
                    fontSize: "1.5rem",
                    textAlign: "center",
                    padding: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Total Employee Count: {TotalemployeeData}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </span>

      <div>
        <div style={{ margin: "1rem" }}>
          <div
            className="d-flex justify-content-center"
            style={{
              display: "flex",
              justifyContent: "start",
              gap: "1rem", // Add gap here for equal spacing between boxes
              flexWrap: "wrap",
            }}
          >
            <div
              className="mb-5 flex-wrap"
              style={{
                display: "flex",
                backgroundColor: "transparent",
              }}
            >
              {boxes.map((box, index) => (
                <div
                  key={index}
                  className={`box-hover ${box.title !== "Exit" ? "box-gap" : ""}`} // Apply gap class selectively
                  style={{
                    width: "200px",
                    padding: "0.5rem",
                    borderRadius: "15px",
                    backgroundColor: `${box.color}`,
                    textAlign: "center",
                    cursor: "pointer",
                    margin: "0.5rem", // Adjusted margin for spacing between boxes
                    boxShadow: "1px 5px 5px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center", // Center content vertically
                  }}
                  onClick={() => handleBoxClick(box.title)}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      fontFamily: "Inter, serif",
                      color: "white",
                    }}
                  >
                    {box.title}
                  </h4>
                  <p style={{ color: "white", fontSize: "2rem" }}>
                    {box.value}
                  </p>

                  {box.title === "Exit" ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span style={{ color: "white", fontSize: "0.8rem" }}>
                          From:
                        </span>
                        <input
                          type="date"
                          name="fromDate"
                          onChange={handleFromDateChange} // Attach handler
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                            color: "white",
                            fontSize: "0.8rem",
                            padding: "0.2rem",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span style={{ color: "white", fontSize: "0.8rem" }}>
                          To:
                        </span>
                        <input
                          type="date"
                          name="toDate"
                          onChange={handleToDateChange} // Attach handler
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
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "1rem", gap: "1rem" }} // Add gap here for equal spacing between boxes
          >
            <div
              style={{
                width: "30%",
                textAlign: "center",
              }}
            >
              <BandGraph isDataUploaded={props.isDataUploaded} />
            </div>
            <div
              style={{
                width: "40%",
                textAlign: "center",
              }}
            >
              <USTExp isDataUploaded={props.isDataUploaded} />
            </div>
            <div
              style={{
                width: "30%",
                textAlign: "center",
              }}
            >
              <ResourceType
                columnname="Resource Type"
                isDataUploaded={props.isDataUploaded}
              />
            </div>
          </div>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "3rem", gap: "1rem" }} // Add gap here for equal spacing between boxes
          >
            <TableRepresentation
              columnname="Country"
              isDataUploaded={props.isDataUploaded}
              style={{ width: "30%", height: "340px" }}
            />

            <EmployeeStatusGraph
              columnname="Employee Status"
              isDataUploaded={props.isDataUploaded}
              style={{ width: "40%", height: "340px" }}
            />
            <CategoryGraph
              columnname="Country"
              isDataUploaded={props.isDataUploaded}
              style={{ width: "30%", height: "340px" }}
            />
          </div>

          {isUser ? null : (
            <>
              {showRepresentation && (
                <DashboardRepresentation
                  data={selectedBoxName}
                  style={{ width: "40%" }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardData;
