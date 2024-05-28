import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import DashboardData from "../../components/DashboardData";

const PrimarySkills = (props) => {
  const data = useSelector((state) => state.Empdata);
  const [selectedOption, setSelectedOption] = useState();
  const [primarySkills, setPrimarySkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [resetManagerSelect, setResetManagerSelect] = useState(false); // State variable for reset action4
  const [resetPrimarySelect, setPrimarySelect] = useState(false);
  const [managerKey, setManagerKey] = useState(0); // Key to force reload ManagerSelect
  const [primarySkillsKey, setPrimarySkillsKey] = useState(0); // Key for PrimarySkills component
  const [categoryKey, setCategoryKey] = useState(0);

  // Function to extract primary skills from employee data
  const extractPrimarySkills = (data) => {
    let skills = [];
    data.forEach((employee) => {
      if (employee["Primary Skill"]) {
        const skillsArray = employee["Primary Skill"].split(",").map((skill) => skill.trim());
        skills = skills.concat(skillsArray);
      }
    });
    return Array.from(new Set(skills));
  };

  useEffect(() => {
    if (data.length > 0) {
      const extractedSkills = extractPrimarySkills(data);
      setPrimarySkills(extractedSkills);
      setLoading(false);
    }
  }, [data]);

  function resetData(){
    console.log("Inside Reset Data");
    setResetManagerSelect(prevState => !prevState); // Toggle state to trigger re-render for ManagerSelect
    setPrimarySelect(prevState => !prevState); // Toggle state to trigger re-render for PrimarySkills
    setManagerKey(prevKey => prevKey + 1); // Update key to force reload ManagerSelect

    setPrimarySkillsKey(prevKey => prevKey + 1); // Update key to force reload PrimarySkills
    setCategoryKey(prevKey => prevKey + 1); // Update key to force reload Category
  }
  
  function handleSelect(selectedOption) {
    console.log('***********************', selectedOption);
    //setSelectedOption(selectedOption);
      setTimeout(()=>{
        if (selectedOption.target.value) {
          console.log('SelectedOptionTest',selectedOption.target.value)
          props.handleBoxClick(selectedOption.target.value);
        } else {
          console.log('^^^^^^^^^^^^^^^^^^^^^^^^^')
          resetData()
        }
      }, 600);
    
  }
  return (
    <div className="text-white " style={{ width: "200px", margin: "10px" }}>
      {loading ? ( // Show loading indicator while data is being fetched
        <p>Loading...</p>
      ) : (
        // <Select
        //   options={primarySkills.sort().map((name) => ({
        //     value: name,
        //     label: name
        //   }))}
        //   placeholder="Primary Skills"
        //   value={selectedOption}
        //   onChange={handleSelect}
        //   isSearchable={true}
         
        //   styles={{
        //     control: (provided, state) => ({
        //       ...provided,
        //       color: "white",
        //       border: state.isFocused ? "2px solid gray" : "2px solid white",
        //       borderRadius: "8px",
        //       backgroundColor: "#0A6E7C"
         
        //     }),
        //     placeholder: (provided) => ({
        //       ...provided,
        //       color: "white" 
        //     }),
        //     option: (provided, state) => ({
        //       ...provided,
        //       backgroundColor: state.isSelected ? "gray" : "gray",
        //       color: "white"
        //     }),
        //     singleValue: (provided) => ({
        //       ...provided,
        //       color: "white"
        //     })
        //   }}
        // />
        <input
        placeholder="Search for Skill"
        type="text"
        onChange={handleSelect}
        style={{
            //color: "white",
            position:  'relative',
            top: '2px',
            height: '37px',
            //width: '19px',
            border: "2px solid #0A6E7C",
            outlineColor: "#0A6E7C",
            borderRadius: "8px",
            //backgroundColor: "#0A6E7C"
        }}
    />                   
      )}
      
     
    </div>
  );
};

export default PrimarySkills;
