import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Form, Input, Label } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import setdata from '../../actions';

function UpdateUserDetails({ id, lastUpdatedDate, handleUpdate }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [clickedCell, setClickedCell] = useState(null); // State to keep track of clicked cell
  const empData = useSelector((state) => state.Empdata);
  const dispatch = useDispatch();

  const [disabledDateColumns, setDisabledDateColumns] = useState([]);

  const toggle = () => setModal(!modal);

  const columnNames = [
    'Employee ID',
    'Employee Name',
    'Band',
    'Employee Type',
    'OBU',
    'OBU Description',
    'Customer ID',
    'Customer Name',
    'Project ID',
    'Project Description',
    'Program Description',
    'Program Manager',
    'Contract Category',
    'Project Manager ID',
    'Project Manager Name',
    'Project Start Date',
    'Project End Date',
    'Country',
    'Location',
    'Location Descr',
    'JobCode',
    'JobCode Descr',
    'Allocation %tage',
    'Resource Type',
    'Manager ID',
    'Manager Name',
    'Hire Date',
    'UST Experience',
    'Employee Status',
    'Status Start Date',
    'Status End Date',
    'Department ID',
    'Department Descr',
    '1st Manager',
    'Category',
    'Primary Skill',
    'Skill Category for Primary Skill',
    'Skill Level for Primary Skill',
    'Secondary Skill',
    'Skill Category for Secondary Skill',
    'Skill Level for Secondary Skill',
    'Tools Known',
    'Certifications',
    'Resume',
    'Shortlist',
  ];

  const dropdownColumns =[
    'Category',
    'Skill Category for Primary Skill',
    'Skill Level for Primary Skill',
    'Skill Category for Secondary Skill',
    'Skill Level for Secondary Skill',
    'Employee Status',
  ]; 

 const dropDownOptions = {
  'Employee Status': [
     "Active",
     "Talent Pool",
     "Maternity Leave",
     "Exit",
   ]
 } 
  const disabledColumns = [
    'Employee ID',
    'Employee Name',
    'Band',
    'Employee Type',
    'OBU',
    'OBU Description',
    'Customer ID',
    'Customer Name',
  ]

  const employeeStatusDateColumns = [
    'Status Start Date',
    'Status End Date',
  ]
  
  useEffect(() => {
    if (modal && id) {
      fetchData(id);
    }
  }, [modal, id]);

  const fetchData = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:3004/fetchEmpByID/${employeeId}`);
      console.log('Response:', response.data); 
      if (response.status === 200) {
        setFormData(response.data[0]);
        setIsLoading(false);
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithoutId = { ...formData };
    delete formDataWithoutId._id;
    

    try {
      const response = await axios.put(`http://localhost:3004/updaterecord/${formData['Employee ID']}`, formDataWithoutId);
      console.log()
      
      if (response.status === 200) {
        // Fetch updated data
        const fetchDataResponse = await axios.get('http://localhost:3004/fetchdata');

        // Dispatch the fetched data
        dispatch(setdata(fetchDataResponse.data));
      
        alert("Updated successfully");
        toggle(); // Close modal after submission
      } else {
        console.error('Error updating the data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const shouldDisableDateColumns = (employeeStatus, columnName) => {
    const statusColumns = ["Status Start Date", "Status End Date"]

    if (employeeStatus == "Active") return true;

    if (employeeStatus == "Exit") return columnName != "Status End Date";

    if (employeeStatus == "Talent Pool" || employeeStatus == "Maternity Leave") return false;
  }

  useEffect(() => {
    const disabledColumns = Object.values(employeeStatusDateColumns).filter(columnName =>
      shouldDisableDateColumns(formData["Employee Status"], columnName)
    );
    setDisabledDateColumns(disabledColumns);
  }, [formData["Employee Status"]]);

  const handleCellClick = (columnName) => {
    setClickedCell(columnName); // Set the clicked cell
  };

  const fetchButtonColor = () => {    
    const now = new Date;
    
    const diffMilliSecs = now - new Date(lastUpdatedDate)
    const diffDays = Math.round(diffMilliSecs / (1000 * 60 * 60 * 24));
    if (diffDays < 30) return "green";
    if (diffDays < 60) return "yellow"
    else return "red"

  }

  return (
    <div>
      <Button style={{ backgroundColor: fetchButtonColor(), color: "black" }}  onClick={toggle}>
        Update
      </Button>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Update Details</ModalHeader>
        <ModalBody>
          {
            isLoading ? (
              <p>Loading...</p>
            ) : (
              <Form onSubmit={handleSubmit}>
                {
                  columnNames.map((columnName) => (
                  <FormGroup key={columnName}>
                    <Label for={columnName}>{columnName}</Label>
                    {
                      dropdownColumns.includes(columnName) ? (
                        <Input
                          type="select"
                          name={columnName}
                          value={formData[columnName] || ''}
                          onChange={handleChange}
                        >
                          <option value="">Select {columnName}</option>
                              {
                                (dropDownOptions[columnName]) ? (
                                  dropDownOptions[columnName].map((optionValue) => {
                                    return (
                              <option key={optionValue} value={optionValue}>
                                {optionValue}
                              </option>
                              );
                                  })
                                ) : 
                                  
                                [...new Set(empData.map(obj => obj[columnName]))]
                                // .filter(optionValue => optionValue !== null)  // Remove null values
                                // .sort((a, b) => a.localeCompare(b))  // Sort values in ascending order
                                .map((optionValue) => {
                                  return (
                            <option key={optionValue} value={optionValue}>
                              {optionValue}
                            </option>
                            );
                                })

                              }
                        </Input>
                      ) : (employeeStatusDateColumns.includes(columnName)) ? (
                        <Input
                        type="date"
                        name={columnName}
                        // disabled={shouldDisableDateColumns(columnName, formData["Employee Status"])}
                        disabled={disabledDateColumns.includes(columnName)}
                        value={formData[columnName] || ''}
                        onChange={handleChange}
                      ></Input>
                      ) :  (
                      <Input
                        id={columnName}
                        name={columnName}
                        placeholder={columnName}
                        type="text"
                        value={formData[columnName] || ''}
                        onChange={handleChange}
                        style={{ flex: clickedCell === columnName ? 2 : 1 }} // Conditionally set flex value
                        onClick={() => handleCellClick(columnName)} // Handle cell click
                        //readOnly={columnName === 'Employee ID'}
                        disabled={disabledColumns.includes(columnName)}
                      />
                      )
                    }
                  </FormGroup>
                  ))
                }
                <Button type="submit" color="primary">
                  Update
                </Button>
              </Form>
            )
          }
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default UpdateUserDetails;