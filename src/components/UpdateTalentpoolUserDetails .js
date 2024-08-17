import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Form, Input, Label } from 'reactstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import setdata from '../actions';

function UpdateTalentpoolUserDetails({ id, lastUpdatedDate, handleUpdate }) {
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [clickedCell, setClickedCell] = useState(null);
  const empData = useSelector((state) => state.Empdata);
  const dispatch = useDispatch();

  const [disabledDateColumns, setDisabledDateColumns] = useState([]);

  const toggle = () => setModal(!modal);

  const columnNames = [
    'UID',
    'Employee Name',
    'Band',
    'UST Joining Date',
    'City',
    'TP Start Date',
    'TP Status',
    'Cost $/Day',
    'CTC (LPA)',
    'Total Years Of experience',
    'Skill Group',
    'TP Comments',
    'Aging',
    'Contact Number',
    'Previous Account',
    'Previous Manager',
    'POC',
    'Opp 1- Account',
    'Feedback',
    'Opp 2- Account',
    'Feedback_1',
    'Opp 3- Account',
    'Feedback_2',
    'Opp 4- Account',
    'Feedback_3',
  ];

  const dropdownColumns = ['TP Status'];

  const dropDownOptions = {
    'TP Status': [
      'Exit',
      'CIS Allocated',
      'Maternity Leave',
      'Active TP Resource',
      'Serving Notice',
    ],
  };

  const disabledColumns = [
    'UID',
    'Employee Name',
    'Band',
    'UST Joining Date',
    'City',
    'TP Start Date',
    'Cost $/Day',
    'CTC (LPA)',
    'Total Years Of experience',
    'Contact Number',
  ];

  useEffect(() => {
    if (modal && id) {
      fetchData(id);
    }
  }, [modal, id]);

  const fetchData = async (employeeId) => {
    try {
        const response = await axios.get(`http://localhost:3004/talentpool/details/${employeeId}`);
        if (response.status === 200 && response.data.length > 0) {
            setFormData(response.data[0]);
            setIsLoading(false);
        } else {
            console.error('No data found for this UID');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data being submitted:', formData);  // Debugging log

    try {
        const response = await axios.put(`http://localhost:3004/talentpoolupdate/${formData['UID']}`, formData);
        if (response.status === 200) {
            console.log('Update successful:', response.data);
            const fetchDataResponse = await axios.get('http://localhost:3004/talentpool/details');  // Fetch all records
            dispatch(setdata(fetchDataResponse.data));  // Update the Redux store
            alert('Updated successfully');
            toggle();
        } else {
            console.error('Error updating the data:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);  // Log any errors
    }
};

  
  
  const fetchButtonColor = () => {
    const now = new Date();
    const diffMilliSecs = now - new Date(lastUpdatedDate);
    const diffDays = Math.round(diffMilliSecs / (1000 * 60 * 60 * 24));

    const standardColors = {
      green: '#2E7D32', // Very dark green
      yellow: '#FF8F00', // Very dark yellow
      red: '#C62828', // Very dark red
    };

    if (diffDays < 30) return standardColors.green;
    if (diffDays < 60) return standardColors.yellow;
    else return standardColors.red;
  };

  return (
    <div>
      <Button style={{ backgroundColor: fetchButtonColor(), color: 'black' }} onClick={toggle}>
        Update
      </Button>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Update Talent Pool Details</ModalHeader>
        <ModalBody>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
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
                   {dropDownOptions[columnName]?.map((optionValue) => (
                     <option key={optionValue} value={optionValue}>
                       {optionValue}
                     </option>
                   ))}
                 </Input>
               ) : (
                 <Input
                   id={columnName}
                   name={columnName}
                   placeholder={columnName}
                   type="text"
                   value={formData[columnName] || ''}
                   onChange={handleChange}
                   disabled={disabledColumns.includes(columnName)}
                 />
               )}
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

export default UpdateTalentpoolUserDetails;
