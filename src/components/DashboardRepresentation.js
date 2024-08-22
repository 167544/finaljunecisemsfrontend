import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import setdata from "../actions";
import setSelectedData from "../actions/setSetlecteddata";
import { Box, Tooltip } from "@mui/material";

const ScrollableCell = ({ value }) => {
  return (
    <Tooltip title={value} arrow>
      <Box
        sx={{
          maxHeight: "100px", // Adjust this height as needed
          overflowY: "auto",
          padding: "5px",
          "&::-webkit-scrollbar": {
            width: "3px", // Width of the scrollbar
            height: "3px", // Height of the scrollbar for horizontal scroll
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888", // Color of the scrollbar thumb
            borderRadius: "5px", // Roundness of the scrollbar thumb
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555", // Color of the scrollbar thumb on hover
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1", // Color of the scrollbar track
          },
          color: "white", // Set the font color to white
          fontSize: "16px",
        }}
      >
        {value}
      </Box>
    </Tooltip>
  );
};

function DashboardRepresentation(props) {
  const [rows, setRows] = useState([]);
  const [data1, setdata] = useState(true);
  const dataGridRef = React.useRef();
  const dispatch = useDispatch();
  const EmployeeDatar = useSelector((state) => state.Empdata);
  const selectedData = useSelector((state) => state.selectedData);

  const [columns, setColumns] = useState([
    { field: "Employee ID", headerName: "Employee ID", width: 150, renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false },
    { field: "Employee Name", headerName: "Employee Name", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false },
    { field: "Band", headerName: "Band", width: 100, renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false },
    { field: "Account Name", headerName: "Account Name", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false },
    { field: "Location Descr", headerName: "Location Descr", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hide: true },
    { field: "Resource Type", headerName: "Resource Type", width: 150, renderCell: (params) => <ScrollableCell value={params.value} />, hide: true },
    { field: "1st Manager", headerName: "1st Manager", width: 150, renderCell: (params) => <ScrollableCell value={params.value} />, hide: true },
    { field: "Client", headerName: "Client", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hide: true },
    { field: "Location", headerName: "Location", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false },
    { field: "Manager Name", headerName: "Manager Name", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false },
    { field: "UST Experience", headerName: "UST Experience", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false },
    { field: "Employee Status", headerName: "Employee Status", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false },
    { field: "Category", headerName: "Category", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false  },
    {
      field: "Primary Skill",
      headerName: "Primary Skill",
      width: 200,
      renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false 
    },
    {
      field: "Skill Level for Primary Skill",
      headerName: "Skill Level for Primary Skill",
      width: 200,
      renderCell: (params) => <ScrollableCell value={params.value} />, hide: true
    },
    {
      field: "Secondary Skill",
      headerName: "Secondary Skill",
      width: 200,
      renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false
    },
    {
      field: "Skill Category for Secondary Skill",
      headerName: "Skill Category for Secondary Skill",
      width: 200,
      renderCell: (params) => <ScrollableCell value={params.value} />, hide: true
    },
    {
      field: "Tertiary Skill",
      headerName: "Tertiary Skill",
      width: 200,
      renderCell: (params) => <ScrollableCell value={params.value} />, hide: true
    },
    {
      field: "Detailed Skill",
      headerName: "Detailed Skill",
      width: 200,
      renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false
    },
    {
      field: "Tools Known",
      headerName: "Tools Known",
      width: 200,
      renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false
    },
    {
      field: 'VISA "YES" Country',
      headerName: 'VISA "YES" Country',
      width: 200,
      renderCell: (params) => <ScrollableCell value={params.value} />, hide: true
    },
    {
      field: "Certifications",
      headerName: "Certifications",
      width: 200,
      renderCell: (params) => <ScrollableCell value={params.value} />, hideable:false
    },
    {
      field: "Resume",
      headerName: "Resume",
      width: 200,
      renderCell: (params) => <ScrollableCell value={params.value} />, hide: true
    },
    {
      field: "Last Updated Date",
      headerName: "Last Updated Date",
      width: 200,
      renderCell: (params) => <ScrollableCell value={params.value} />, hide: true
    },
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

  useEffect(() => {
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
      const filteredEmployees = EmployeeDatar.filter((employee) => {
        if (!employee["Primary Skill"]) return false;
        return employee["Primary Skill"].toLowerCase().search(skill.toLowerCase()) > -1;
      });
      dispatch(setSelectedData(filteredEmployees));
      setRows(filteredEmployees);
    };
  
    const fetchEmpOnCategory = () => {
      let category = props.data.slice(0, -8);
      const filteredEmployees = EmployeeDatar.filter((employee) => {
        if (!employee["Category"]) return false;
        return employee["Category"].toLowerCase().search(category.toLowerCase()) > -1;
      });
      dispatch(setSelectedData(filteredEmployees));
      setRows(filteredEmployees);
    };
  
    // New function to filter by Client
    const fetchEmpOnClient = () => {
      let client = props.data.slice(0, -6); // Assuming the prop data for client ends with 'client'
      const filteredEmployees = EmployeeDatar.filter((employee) => {
        if (!employee["Client"]) return false;
        return employee["Client"].toLowerCase().includes(client.toLowerCase());
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
    } else if (props.data.slice(-6) === "client") {  // Adjust this based on your client filter identifier
      fetchEmpOnClient();  // Call the new client filter function
    } else {
      fetchData();
    }
  }, [props.data, data1, EmployeeDatar]);
  

  useEffect(() => {
    setRows(selectedData);
  }, [selectedData]);

  const handleCellClick = (params) => {
    const clickedField = params.field;
    const content = params.value;

    // Create a temporary element to measure the content width
    const tempElement = document.createElement('span');
    tempElement.style.fontSize = '16px'; // Use the same font size as in the DataGrid
    tempElement.style.fontFamily = 'Inter, serif'; // Use the same font family as in the DataGrid
    tempElement.style.visibility = 'hidden'; // Make it invisible
    tempElement.style.whiteSpace = 'nowrap'; // Prevent wrapping
    tempElement.innerText = content;

    // Append the element to the body to calculate its width
    document.body.appendChild(tempElement);
    const contentWidth = tempElement.offsetWidth + 20; // Get the width and add some padding
    document.body.removeChild(tempElement); // Remove the temporary element

    const updatedColumns = columns.map((column) => {
      if (column.field === clickedField) {
        return { ...column, width: Math.min(Math.max(column.width, contentWidth), 400) }; // Set width based on content width with a maximum limit of 400px
      }
      return column;
    });

    setColumns(updatedColumns);
  };

  const getRowId = (row) => row._id;

  return (
    <div style={{ height: 500, width: "100%", padding: "10px", overflow: "auto" }}>
      <DataGrid
        className="text-light"
        rows={rows}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            style: { backgroundColor: "#0A2342", color: "white" },
            button: {
              color: "white",
            },
            menuItem: {
              color: "white",
            },
          },
        }}
        getRowId={getRowId}
        apiRef={dataGridRef}
        onCellClick={handleCellClick}
        sx={{
          "& .MuiDataGrid-root": {
            backgroundColor: "#0A2342",
            borderColor: "#0A2342",
          },
          "& .MuiDataGrid-virtualScroller": {
            overflowX: "auto !important", // Ensure horizontal scrolling is enabled
          },
          "& .MuiDataGrid-cell": {
            color: "white",
            borderColor: "#0A2342",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "150px",
            fontSize: "16px", // Increase the font size
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#0A2342",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            color: "white",
            fontSize: "16px", // Increase the font size for column headers
          },
          "& .MuiDataGrid-toolbar": {
            color: "white",
          },
          "& .MuiTablePagination-root": {
            color: "white",
            backgroundColor: "#0A2342",
          },
          "& .MuiTablePagination-toolbar": {
            color: "white",
          },
          "& .MuiInputBase-root": {
            color: "white",
          },
          "& .MuiTablePagination-actions": {
            color: "white",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#0A2342",
            color: "white",
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
              color: 'white', // Change toolbar icons and text color to white
            },
            '& .MuiDataGrid-toolbarContainer .MuiSvgIcon-root': {
              color: 'white', // Change toolbar icons to white
            },
        }}
        disableColumnMenu
        disableSelectionOnClick
        scrollbarSize={10} // Adjust scrollbar size
      />
    </div>
  );
}

export default DashboardRepresentation;
