import React, { useEffect, useState } from "react";
import BandGraph from "./BandGraph";
import CategoryGraph from "./CategoryGraph";
import axios from "axios";
import TableRepresentation from "./TableRepresentation";

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
    <div className="d-flex w-100">
        <div className="col-6 mt-3">
            <BandGraph 
            employeeData={employeeData}
            isLoadedFromDynamicEmp={true}
            maleEmployees={maleEmployees}
            femaleEmployees={femaleEmployees} 
            />
        </div>

        <div className="col-6">
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
  );
};


export default DynamicEmp
