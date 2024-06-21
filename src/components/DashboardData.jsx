import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
import { act } from "react-dom/test-utils";
import CategoryGraph from "./CategoryGraph";

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
  const [resourceWithValidVisaCount, setResourceWithValidVisaCount] =
    useState(0);
  const [resourseExitEmployeesCount, setResourceExitEmployeesCount] =
    useState(0); //CodeByJ - state to find exit count
  const [newlyAddedEmployeesCount, setNewlyAddedEmployeesCount] = useState(0); //CodeByJ - state to find newly added employees
  const [showRepresentation, setShowRepresentation] = useState(true);
  const [selectedBoxName, setSelectedBoxName] = useState("");
  const [TotalemployeeData, setTotalEmployeeData] = useState(0);

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

  const boxes = [
    { title: "Total Employees", value: employeeData.length, color: "#006E74" },
    { title: "Total Customers", value: customerCount, color: "#0097AC" },
    {
      title: "Active Employee Count",
      value: activeEmployeeCount,
      color: "#01B27C",
    },
    {
      title: "Resources with Valid Visa",
      value: resourceWithValidVisaCount,
      color: "#003C51",
    },
    { title: "Exit", value: resourseExitEmployeesCount, color: "#005B31" },
    {
      title: "Newly Joined Employees",
      value: newlyAddedEmployeesCount,
      color: "#0C4D15",
    },
  ];

  return (
    <>
      <span
        style={{ display: "inline-block", marginBottom: "1rem", width: "100%" }}
      >
        <div className="container-fluid d-flex" style={{ width: "100%" }}>
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
              {/* <a style={{  height: '35px', cursor:'pointer'}} className="mt-4" variant="contained" color="primary" onClick={resetSelectComponent}>Reset</a> */}
              <button
                style={{
                  height: "35px",
                  cursor: "pointer",
                  border: "2px solid #0A6E7C", // Adding border with primary color
                  backgroundColor: "transparent", // Transparent background to highlight the border
                  color: "#0A6E7C", // Matching text color with border
                }}
                className="mt-3"
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
              className="me-4"
              style={{
                height: "110px",
                boxShadow: "4px 7px 22px -7px",
                fontFamily: "sans-serif",
                fontSize: "2rem",
                color: "#003C51",
              }}
            >
              <h1
                style={{
                  fontSize: "0.9rem",
                  textAlign: "center",
                  padding: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Total Employee Count
              </h1>
              <p style={{ textAlign: "center" }}>{TotalemployeeData}</p>
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
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div
              className="mb-5 flex-wrap"
              style={{
                display: "flex",
                backgroundColor: "white",
                borderRadius: "5px",
                boxShadow: "4px 7px 22px -7px",
              }}
            >
              {boxes.map((box, index) => (
                <div
                  key={index}
                  style={{
                    width: "200px",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    backgroundColor: `${box.color}`,
                    textAlign: "center",
                    cursor: "pointer",
                    margin: "1rem",
                  }}
                  onClick={() => handleBoxClick(box.title)}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      fontFamily: "serif",
                      color: "white",
                    }}
                  >
                    {box.title}
                  </h4>
                  <p style={{ color: "white", fontSize: "2rem" }}>
                    {box.value}
                  </p>

                  {/* CodeByJ - adding radion buttons if 'exit' */}
                  {box.title === "Exit" ? (
                    <div>
                      <div>
                        <input
                          className="form-check-input"
                          type="radio"
                          id="option1"
                          name="exitOptions"
                          value="option1"
                        />
                        <label
                          className="form-check-label text-white mx-2"
                          htmlFor="option1"
                        >
                          &lt; 6 Months
                        </label>
                        <br />
                      </div>

                      <div>
                        <input
                          className="form-check-input"
                          type="radio"
                          id="option2"
                          name="exitOptions"
                          value="option2"
                        />
                        <label
                          className="form-check-label text-white mx-2"
                          htmlFor="option2"
                        >
                          6 Months - 1 Year
                        </label>
                        <br />
                      </div>

                      <div>
                        <input
                          className="form-check-input"
                          type="radio"
                          id="option3"
                          name="exitOptions"
                          value="option3"
                        />
                        <label
                          className="form-check-label text-white mx-2"
                          htmlFor="option3"
                        >
                          1 Year - 2 Year
                        </label>
                        <br />
                      </div>

                      <div>
                        <input
                          className="form-check-input"
                          type="radio"
                          id="option4"
                          name="exitOptions"
                          value="option4"
                        />
                        <label
                          className="form-check-label text-white mx-2"
                          htmlFor="option4"
                        >
                          2+ Years
                        </label>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "1rem" }}
          >
            <div
              style={{ width: "30%", textAlign: "center", marginRight: "1rem" }}
            >
              <BandGraph isDataUploaded={props.isDataUploaded} />
            </div>
            <div
              style={{ width: "40%", textAlign: "center", marginRight: "1rem" }}
            >
              <USTExp isDataUploaded={props.isDataUploaded} />
            </div>
            <div
              style={{ width: "30%", textAlign: "center", marginRight: "1rem" }}
            >
              <ResourceType
                columnname="Resource Type"
                isDataUploaded={props.isDataUploaded}
              />
            </div>
          </div>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "3rem" }}
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
            {/* <AllocationPerGraph columnname="Allocation Percentage" isDataUploaded={props.isDataUploaded} /> */}
          </div>

          {/* <div className="d-flex justify-content-around" style={{ marginTop: '2rem' }}>
                     
          </div> */}

          {isUser ? null : (
            <>
              {/* <Button className="m-2" variant="contained" color="primary" onClick={() => handleBoxClick('selectedlist')}>Shortlist List</Button> */}
              {/* <Button className="m-2" variant="contained" color="primary" onClick={() => handleBoxClick('removedlist')}>Removed List</Button> */}

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
