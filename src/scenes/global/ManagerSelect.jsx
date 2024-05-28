import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";

const ManagerSelect = (props) => {
  const empData = useSelector((state) => state.Empdata);
  const [selectedOption, setSelectedOption] = useState("");
  const [managers, setManagers] = useState([]);
  const [disabled, setDisabled] = useState(false); // State to track if Select should be disabled

  // Memoize handleSelect to prevent unnecessary re-renders
  const handleSelect = useCallback((selectedOption) => {
    setSelectedOption(selectedOption);
    if (selectedOption) {
      props.handleBoxClick(selectedOption.label);
    }
  }, [props]);

  useEffect(() => {
    if (empData.length > 0) {
      const allManagers = empData.reduce((acc, emp) => {
        const { "1st Manager": manager1, "2nd Manager": manager2, "3rd Manager": manager3, "Manager Name": managerName } = emp;
        if (manager1) acc.add(manager1);
        if (manager2) acc.add(manager2);
        if (manager3) acc.add(manager3);
        if (managerName) acc.add(managerName);
        return acc;
      }, new Set());
      setManagers(Array.from(allManagers));
      
    }

   


   
  }, [empData]);



  useEffect(()=>{
    let role = localStorage.getItem('UserRole') 

    if(role === "Admin"){
      const name = localStorage.getItem("name");
      handleSelect({ value: name, label: name });
      setDisabled(true);
    }
  } ,[])



  return (
    <div className="text-white" style={{ margin: "10px" }}>
      <Select
        options={managers.map((name) => ({
          value: name,
          label: name
        }))}
        placeholder="Select manager"
        value={selectedOption}
        onChange={handleSelect}
        isSearchable={true}
        isDisabled={disabled} // Disable the Select based on the state
        styles={{
          control: (provided, state) => ({
            ...provided,
            color: "white",
            border: state.isFocused ? "2px solid gray" : "2px solid white",
            borderRadius: "8px",
            backgroundColor: "#0A6E7C",
            color: "white"
          }),
          placeholder: (provided) => ({
            ...provided,
            color: "white"
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "gray" : "gray",
            color: "white"
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "white"
          })
        }}
      />
    </div>
  );
};

export default ManagerSelect;
