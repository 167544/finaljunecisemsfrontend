import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import setdata from '../actions';
import setSelectedData from '../actions/setSetlecteddata';

function DashboardRepresentation(props) {
  const [rows, setRows] = React.useState([]);
  const [data1, setdata] = React.useState(true);
  const dataGridRef = React.useRef();
  const dispatch = useDispatch();
  const EmployeeDatar = useSelector((state) => state.Empdata);
  const selectedData = useSelector((state) => state.selectedData);

  const [columns, setColumns] = React.useState([
    { field: 'Employee ID', headerName: 'Employee ID', flex: 1 },
    { field: 'Employee Name', headerName: 'Employee Name', flex: 2 },
    { field: 'Band', headerName: 'Band', flex: 0.5 },
    { field: 'Customer Name', headerName: 'Customer Name', flex: 2 },
    { field: 'Location Descr', headerName: 'Location Descr', flex: 2 },
    { field: 'Resource Type', headerName: 'Resource Type', flex: 1 },
    
    { field: '1st Manager', headerName: '1st Manager', flex: 1 },
    // { field: '2nd Manager', headerName: '2nd Manager', flex: 1 },
    // { field: '3rd Manager', headerName: '3rd Manager', flex: 1 },
    // { field: '4th Manager', headerName: '4th Manager', flex: 1 },
    // { field: '5th Manager', headerName: '5th Manager', flex: 1 },
    //{ field: 'Skill Category for Primary Skill', headerName: 'Skill Category for Primary Skill', flex: 2 },
    //{ field: 'Primary Skill', headerName: '5th Manager', flex: 1 },
    { field: 'Category', headerName: 'Category', flex: 2 },
    { field: 'Primary Skill', headerName: 'Primary Skill', flex: 2 },
    { field: 'Skill Level for Primary Skill', headerName: 'Skill Level for Primary Skill', flex: 2 },
    { field: 'Secondary Skill', headerName: 'Secondary Skill', flex: 1 },
    { field: 'Skill Category for Secondary Skill', headerName: 'Skill Category for Secondary Skill', flex: 1 },
    { field: 'Tertiary Skill', headerName: 'Tertiary Skill', flex: 1 },
    { field: 'Detailed Skill', headerName: 'Detailed Skill', flex: 1 },
    { field: 'Tools Known', headerName: 'Tools Known', flex: 1 },
    { field: 'VISA "YES" Country', headerName: 'VISA "YES" Country', flex: 1 },
    { field: 'Certifications', headerName: 'Certifications', flex: 1 },
    { field: 'Resume', headerName: 'Resume', flex: 1 },
    { field: 'Last Updated Date', headerName: 'Last Updated Date', flex: 1 },
    
  ]);

  const addedToShortlist = async (id) => {
    try {
      alert("Selected  " + id);
      const response = await axios.put(`http://localhost:3004/addtoshortlist/${id}`);
      console.log("Testing Add to shortlist ", response);
    } catch (error) {
      console.error(error);
    }
  };

  const RemoveFromList = async (id) => {
    try {
      alert("Selected and added to selection list " + id);
      const response = await axios.put(`http://localhost:3004/removefromshorlist/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = () => {
    setdata((prevState) => !prevState);
    if (dataGridRef.current) {
      dataGridRef.current.api.applyFilter({});
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setRows(EmployeeDatar);
    };

    const fetchEmpOnManager = async () => {
      try {
        const response = await axios.get(`http://localhost:3004/getMangersOFEmployee/${props.data.slice(0, -7)}`);
        dispatch(setSelectedData(response.data));
        setRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchEmpOnPrimaryskills = () => {
      let skill = props.data.slice(0, -6);
      const filteredEmployees = EmployeeDatar.filter(employee => {
        if (!employee['Primary Skill']) return false;
        return employee['Primary Skill'].toLowerCase().search(skill.toLowerCase()) > -1;
      });
      dispatch(setSelectedData(filteredEmployees));
      setRows(filteredEmployees);
    };

    const fetchEmpOnCategory = () => {
      let category = props.data.slice(0, -8);
      const filteredEmployees = EmployeeDatar.filter(employee => {
        if (!employee['Category']) return false;
        return employee['Category'].toLowerCase().search(category.toLowerCase()) > -1;
      });
      dispatch(setSelectedData(filteredEmployees));
      setRows(filteredEmployees);
    };

    if (props.data.slice(-7) === "manager") {
      fetchEmpOnManager();
    } else if (props.data.slice(-6) === "skills") {
        fetchEmpOnPrimaryskills();
    } else if (props.data.slice(-8) === "category") {
        fetchEmpOnCategory();
    } else {
        fetchData();
    }
  }, [props.data, data1, EmployeeDatar]);

  React.useEffect(() => {
    setRows(selectedData);
  }, [selectedData]);

  const handleCellClick = (params) => {
    const clickedField = params.field;
    const updatedColumns = columns.map(column => {
      if (column.field === clickedField) {
        return { ...column, flex: 2 };
      } else {
        return { ...column, flex: 1 };
      }
    });
    setColumns(updatedColumns);
  };

  const getRowId = (row) => row._id;

  return (
    <div>
      <div style={{ height: 500, width: "100%", padding: "10px" }}>
        <DataGrid
          className="text-light"
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              style: { backgroundColor: "#0A2342", color: 'white' }, // Set toolbar background and text color
              button: {
                color: 'white', // Set toolbar button text color
              },
              menuItem: {
                color: 'white', // Set toolbar menu item text color
              }
            }
          }}
          getRowId={getRowId}
          apiRef={dataGridRef}
          onCellClick={handleCellClick}
          sx={{
            '& .MuiDataGrid-root': {
              backgroundColor: '#0A2342', // Set table background color
              borderColor: '#0A2342', // Set table border color
            },
            '& .MuiDataGrid-cell': {
              color: 'white',
              borderColor: '#0A2342', // Set cell border color
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#0A2342', // Set header background color
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              color: 'white',
            },
            '& .MuiDataGrid-toolbar': {
              color: 'white',
            },
            '& .MuiTablePagination-root': {
              color: 'white',
              backgroundColor: '#0A2342', // Set pagination background color
            },
            '& .MuiTablePagination-toolbar': {
              color: 'white',
            },
            '& .MuiInputBase-root': {
              color: 'white',
            },
            '& .MuiTablePagination-actions': {
              color: 'white',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#0A2342', // Set footer background color
              color: 'white',
            },
          }}
        />
      </div>
    </div>
  );
}

export default DashboardRepresentation;
