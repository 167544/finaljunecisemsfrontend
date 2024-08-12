import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";

const ClientSelect = (props) => {
  const empData = useSelector((state) => state.Empdata);
  const [selectedOption, setSelectedOption] = useState("");
  const [clients, setClients] = useState([]);
  const [disabled, setDisabled] = useState(false); // State to track if Select should be disabled

  // Memoize handleSelect to prevent unnecessary re-renders
  const handleSelect = useCallback((selectedOption) => {
    console.log("Client selected:", selectedOption); // Debug log
    setSelectedOption(selectedOption);
    if (selectedOption) {
      // Pass the selected client's value to the parent component
      props.handleClientSelect(selectedOption);
    }
  }, [props]);
  
  

  useEffect(() => {
    if (empData.length > 0) {
      const allClients = empData.reduce((acc, emp) => {
        const client = emp.Client;
        if (client) acc.add(client);
        return acc;
      }, new Set());
      setClients(Array.from(allClients));
    }
  }, [empData]);

  useEffect(() => {
    let role = localStorage.getItem("UserRole");

    if (role === "ClientAdmin") {
      const client = localStorage.getItem("client");
      handleSelect({ value: client, label: client });
      setDisabled(true);
    }
  }, [handleSelect]);

  return (
    <div className="text-white" style={{ margin: "5px" }}>
      <Select
        options={clients.map((client) => ({
          value: client,
          label: client
        }))}
        placeholder="Select client"
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
            backgroundColor: "#0A2342",
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

export default ClientSelect;
