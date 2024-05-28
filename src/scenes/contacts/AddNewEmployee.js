import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Form, Input, Label } from 'reactstrap';
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
import setdata from '../../actions';

function AddNewEmployee({ handleInsert }) {
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false); // No need to set loading initially
  const empData = useSelector((state) => state.Empdata);
  console.log("av-emp-data2",empData);
  const dispatch = useDispatch();

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
    // 'Last Updated Date',
  ];

  const dropdownColumns =[
    'Category',
    'Skill Category for Primary Skill',
    'Skill Level for Primary Skill',
    'Skill Category for Secondary Skill',
    'Skill Level for Secondary Skill'
  ]; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3004/insertemp', formData);
      
      if (response.status === 201) {
        // Fetch updated data
        const fetchDataResponse = await axios.get('http://localhost:3004/fetchdata');

        // Dispatch the fetched data
        dispatch(setdata(fetchDataResponse.data));
      
        alert("Inserted successfully");
        toggle(); // Close modal after submission
      } else {
        console.error('Error inserting the data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Button backgroundColor="#0A6E7D" onClick={toggle}>
        Add New Employee
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Insert Details</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
             {columnNames.map((columnName) => (
               <FormGroup key={columnName}>
      <Label for={columnName}>{columnName}</Label>
      {dropdownColumns.includes(columnName) ? (
        <Input
          type="select"
          name={columnName}
          value={formData[columnName] || ''}
          onChange={handleChange}
        >
          <option value="">Select {columnName}</option>
              {[...new Set(empData.map(obj => obj[columnName]))]
              // .filter(optionValue => optionValue !== null)  // Remove null values
              // .sort((a, b) => a.localeCompare(b))  // Sort values in ascending order
              .map((optionValue) => {
                console.log("av-col:",columnName,optionValue);  // Log columnName
                return (
          <option key={optionValue} value={optionValue}>
            {optionValue}
          </option>
          );
})}

        </Input>
      ) : (
        <Input
          id={columnName}
          name={columnName}
          placeholder={columnName}
          type="text"
          value={formData[columnName] || ''}
          onChange={handleChange}
        />
      )}
               </FormGroup>
             ))}
  <Button type="submit" color="primary">
    Add new Record
  </Button>
          </Form>
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

export default AddNewEmployee;
