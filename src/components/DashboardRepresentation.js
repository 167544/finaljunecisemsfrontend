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
    { field: "Employee ID", headerName: "Employee ID", flex: 1 },
    { field: "Employee Name", headerName: "Employee Name", flex: 2 },
    { field: "Band", headerName: "Band", flex: 0.5 },
    { field: "Customer Name", headerName: "Customer Name", flex: 2 },
    { field: "Location Descr", headerName: "Location Descr", flex: 2 },
    { field: "Resource Type", headerName: "Resource Type", flex: 1 },
    { field: "1st Manager", headerName: "1st Manager", flex: 1 },
    { field: "Category", headerName: "Category", flex: 2 },
    {
      field: "Primary Skill",
      headerName: "Primary Skill",
      flex: 2,
      renderCell: (params) => <ScrollableCell value={params.value} />,
    },
    {
      field: "Skill Level for Primary Skill",
      headerName: "Skill Level for Primary Skill",
      flex: 2,
      renderCell: (params) => <ScrollableCell value={params.value} />,
    },
    {
      field: "Secondary Skill",
      headerName: "Secondary Skill",
      flex: 1,
      renderCell: (params) => <ScrollableCell value={params.value} />,
    },
    {
      field: "Skill Category for Secondary Skill",
      headerName: "Skill Category for Secondary Skill",
      flex: 1,
      renderCell: (params) => <ScrollableCell value={params.value} />,
    },
    {
      field: "Tertiary Skill",
      headerName: "Tertiary Skill",
      flex: 1,
      renderCell: (params) => <ScrollableCell value={params.value} />,
    },
    {
      field: "Detailed Skill",
      headerName: "Detailed Skill",
      flex: 1,
      renderCell: (params) => <ScrollableCell value={params.value} />,
    },
    {
      field: "Tools Known",
      headerName: "Tools Known",
      flex: 1,
      renderCell: (params) => <ScrollableCell value={params.value} />,
    },
    {
      field: 'VISA "YES" Country',
      headerName: 'VISA "YES" Country',
      flex: 1,
      renderCell: (params) => <ScrollableCell value={params.value} />,
    },
    {
      field: "Certifications",
      headerName: "Certifications",
      flex: 1,
      renderCell: (params) => <ScrollableCell value={params.value} />,
    },
    {
      field: "Resume",
      headerName: "Resume",
      flex: 1,
      renderCell: (params) => <ScrollableCell value={params.value} />,
    },
    {
      field: "Last Updated Date",
      headerName: "Last Updated Date",
      flex: 1,
      renderCell: (params) => <ScrollableCell value={params.value} />,
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

  useEffect(() => {
    setRows(selectedData);
  }, [selectedData]);

  const handleCellClick = (params) => {
    const clickedField = params.field;
    const updatedColumns = columns.map((column) => {
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
            "& .MuiDataGrid-cell": {
              color: "white",
              borderColor: "#0A2342",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "150px",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#0A2342",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "white",
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
          }}
          disableColumnMenu
          disableSelectionOnClick
        />
      </div>
    </div>
  );
}

export default DashboardRepresentation;
