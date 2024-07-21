import React, { useEffect, useState } from "react";
import BandGraph from "./BandGraph";
import CategoryGraph from "./CategoryGraph";
import axios from "axios";
import TableRepresentation from "./TableRepresentation";
import MapRepresentation from "./MapRepresentation";
import SkillGroupTalentpool from "./SkillGroupTalentpool";
import LocationChartTalentpool from "./LocationChartTalentpool";
import BandGraphDiversity from "../components/BandGraphDiversity";

const DynamicEmp = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [maleEmployees, setMaleEmployees] = useState([]);
  const [femaleEmployees, setFemaleEmployees] = useState([]);
  const [maleEmployeeCount, setMaleEmployeeCount] = useState(0);
  const [femaleEmployeeCount, setFemaleEmployeeCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3004/fetchdata");
      setEmployeeData(response.data);

      // Calculate male and female employee counts
      const maleEmployees = response.data.filter(
        (item) => item["Gender"] === "M"
      );
      setMaleEmployees(maleEmployees);
      setMaleEmployeeCount(maleEmployees.length);

      const femaleEmployees = response.data.filter(
        (item) => item["Gender"] === "F"
      );
      setFemaleEmployees(femaleEmployees);
      setFemaleEmployeeCount(femaleEmployees.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="d-flex w-100 flex-column">
      <div className="d-flex w-100 mb-3 justify-content-center">
        <div style={{ width: "100%", maxWidth: "1070px", backgroundColor: "#0A2342", borderRadius: "10px", padding: "10px", boxSizing: "border-box" }}>
          <MapRepresentation />
        </div>
      </div>
      <div className="d-flex w-100 mb-2" style={{ gap: "0rem" }}>
        <div style={{ flex: "1 1 70%", paddingLeft: "8rem" }}>
          <div style={{ width: "100%" }}>
            <BandGraphDiversity 
              employeeData={employeeData}
              isLoadedFromDynamicEmp={true}
              maleEmployees={maleEmployees}
              femaleEmployees={femaleEmployees}
              style={{ width: "100%", minWidth: "600px" }} // Adjust the width here
            />
          </div>
        </div>
        <div style={{ flex: "1 1 30%", paddingRight: "11rem" }}>
          <div style={{ width: "100%" }}>
            
            <TableRepresentation
              employeeData={employeeData}
              maleEmployees={maleEmployees}
              femaleEmployees={femaleEmployees}
              isLoadedFromDynamicEmp={true}            
              columnname="CountryGraph"
              style={{ width: "100%", height: "340px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicEmp;
