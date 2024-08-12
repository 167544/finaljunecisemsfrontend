import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Form, Input, Label } from 'reactstrap';
import axios from 'axios';

const initialColumns = [
  { field: 'UID', headerName: 'UID', width: 100 },
  { field: 'Employee Name', headerName: 'Employee Name', width: 150 },
  { field: 'Band', headerName: 'Band', width: 100 },
  { field: 'UST Joining Date', headerName: 'UST Joining Date', width: 150 },
  { field: 'City', headerName: 'City', width: 100 },
  { field: 'TP Start Date', headerName: 'TP Start Date', width: 150 },
  { field: 'TP Status', headerName: 'TP Status', width: 150 },
  { field: 'Cost $/Day', headerName: 'Cost $/Day', width: 100 },
  { field: 'CTC (LPA)', headerName: 'CTC (LPA)', width: 100 },
  { field: 'Total Years Of experience', headerName: 'Total Years Of experience', width: 200 },
  { field: 'Skill Group', headerName: 'Skill Group', width: 150 },
  { field: 'TP Comments', headerName: 'TP Comments', width: 200 },
  { field: 'Aging', headerName: 'Aging', width: 100 },
  { field: 'Contact Number', headerName: 'Contact Number', width: 150 },
  { field: 'Previous Account', headerName: 'Previous Account', width: 200 },
  { field: 'Previous Manager', headerName: 'Previous Manager', width: 200 },
  { field: 'POC', headerName: 'POC', width: 100 },
  { field: 'Opp 1- Account', headerName: 'Opp 1- Account', width: 150 },
  { field: 'Feedabck', headerName: 'Feedabck', width: 150 },
  { field: 'Opp 2- Account', headerName: 'Opp 2- Account', width: 150 },
  { field: 'Feedabck_1', headerName: 'Feedabck 1', width: 150 },
  { field: 'Opp 3- Account', headerName: 'Opp 3- Account', width: 150 },
  { field: 'Feedabck_2', headerName: 'Feedabck 2', width: 150 },
  { field: 'Opp 4- Account', headerName: 'Opp 4- Account', width: 150 },
  { field: 'Feedabck_3', headerName: 'Feedabck 3', width: 150 },
];

function UpdateTalentpoolUserDetails({ id, handleUpdate }) {
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const toggle = () => setModal(!modal);

  useEffect(() => {
    if (modal && id) {
      fetchData(id);
    }
  }, [modal, id]);

  const fetchData = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:3004/talentpool/details/${employeeId}`);
      if (response.status === 200 && response.data.length > 0) {
        setFormData(response.data[0]); // Access the first element in the array
        setIsLoading(false);
      } else {
        console.error('Error fetching data or no data found');
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
    await handleUpdateTalentPool(id, formData); // Call the handleUpdateTalentPool function
    toggle(); // Close the modal after submission
  };

  return (
    <div>
      <Button onClick={toggle} style={{ backgroundColor: '#0A2342', color: 'white' }}>
        Update
      </Button>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Update Employee Details</ModalHeader>
        <ModalBody>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Form onSubmit={handleSubmit}>
              {initialColumns.map((column, index) => (
                <FormGroup key={column.field}>
                  <Label for={column.field}>{column.headerName}</Label>
                  <Input
                    id={column.field}
                    name={column.field}
                    value={formData[column.field] || ''}
                    onChange={handleChange}
                    type={typeof formData[column.field] === 'number' ? 'number' : 'text'}
                    disabled={index < 5} // Disable the first 5 fields
                  />
                </FormGroup>
              ))}
              <Button type="submit" color="primary">
                Update
              </Button>
            </Form>
          )}
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

const handleUpdateTalentPool = async (employeeId, updatedData) => {
  try {
    const response = await axios.put(`http://localhost:3004/talentpoolupdate/${employeeId}`, updatedData);
    if (response.status === 200) {
      alert("Talent pool data updated successfully");
      // Refresh data or perform any other actions needed
    } else {
      console.error('Error updating talent pool data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export default UpdateTalentpoolUserDetails;
