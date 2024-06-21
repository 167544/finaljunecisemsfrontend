import React, { useEffect, useState } from "react";
import { Box, Modal, Typography, TextField, Button as MUIButton } from "@mui/material"; // Renamed MUI Button to avoid conflicts
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import UpdateUserDetails from "./UpdateUserDetails";
import axios from "axios";
import setdata from "../../actions";
import AddNewEmployee from "./AddNewEmployee";
import { format } from "date-fns";
import { Tooltip } from "@mui/material";

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
        }}
      >
        {value}
      </Box>
    </Tooltip>
  );
};

const Contacts = () => {
  const data = useSelector((state) => state.Empdata);
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [manageTeam, setManageTeam] = useState([]);
  const [isUpdate, setIsUpdated] = useState(0);
  const [columns, setColumns] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3004/deleteRecord/${id}`);
      const fetchDataResponse = await axios.get("http://localhost:3004/fetchdata");
      dispatch(setdata(fetchDataResponse.data));
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    handleCloseModal();
  };

  useEffect(() => {
    const dataWithIds = data.map((row) => ({ id: row._id, ...row }));
    setManageTeam(dataWithIds);

    const initialColumns = [
      { field: "Employee ID", headerName: "Emp ID", flex: 0.5 },
      { field: "Employee Name", headerName: "Emp Name" },
      { field: "Band", headerName: "Band" },
      {
        field: "Resource with Valid VISA",
        headerName: "Resource with Valid VISA",
        flex: 1,
        renderCell: (params) => (
          <div style={{ color: "black" }}>{params.value}</div>
        ),
      },
      { field: "Customer Name", headerName: "Customer Name", headerAlign: "left", align: "left" },
      { field: "Contract Category", headerName: "Contract Category", flex: 1 },
      { field: "Country", headerName: "Country", flex: 1 },
      { field: "Location Descr", headerName: "Location Descr", flex: 1 },
      { field: "Resource Type", headerName: "Resource Type", flex: 1 },
      { field: "Manager Name", headerName: "Manager Name", flex: 1 },
      { field: "Category", headerName: "Category", flex: 1 },
      {
        field: "Primary Skill",
        headerName: "Primary Skill",
        flex: 1,
        renderCell: (params) => <ScrollableCell value={params.value} />,
      },
      { field: "Skill Category for Primary Skill", headerName: "Skill Category for Primary Skill", flex: 1 },
      { field: "Skill Level for Primary Skill", headerName: "Skill Level for Primary Skill", flex: 1 },
      { field: "Secondary Skill", headerName: "Secondary Skill", flex: 1 },
      { field: "Skill Category for Secondary Skill", headerName: "Skill Category for Secondary Skill", flex: 1 },
      { field: "Tools Known", headerName: "Tools Known", flex: 1 },
      {
        field: "Last Updated Date",
        headerName: "Last Updated Date",
        flex: 1,
        renderCell: (params) => <div>{format(new Date(params.value), "dd/MM/yyyy")}</div>,
      },
      {
        field: "Update",
        headerName: "Update",
        flex: 2,
        renderCell: (params) => (
          <UpdateUserDetails
            id={params.row ? params.row["Employee ID"] : ""}
            handleUpdate={handleUpdate}
            lastUpdatedDate={params.row["Last Updated Date"]}
            style={{ margin: "10px" }}
          />
        ),
      },
      {
        field: "delete",
        headerName: "Training and Certifications",
        flex: 2,
        renderCell: (params) => (
          <MUIButton
            onClick={() => handleOpenModal(params.row)}
            disabled={false}
            sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
          >
            T and C
          </MUIButton>
        ),
      },
    ];

    setColumns(initialColumns);
  }, [data, isUpdate]);

  const handleUpdate = () => {
    setIsUpdated((prevState) => prevState + 1);
  };

  const handleCellClick = (params) => {
    const updatedColumns = columns.map((column) => {
      if (column.field === params.field) {
        return { ...column, flex: 5 };
      } else if (column.field === "Update" || column.field === "delete") {
        return { ...column, flex: 3 };
      }
      return { ...column, flex: 2 };
    });
    setColumns(updatedColumns);
  };

  return (
    <Box m="20px">
      <Box
  m="40px 0 0 0"
  height="75vh"
  sx={{
    "& .MuiDataGrid-root": {
      border: "none",
    },
    "& .MuiDataGrid-cell": {
      borderBottom: "none",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#0A6E7C",
      borderBottom: "none",
      color: "white",
      height: "auto", // Adjust height based on content
      "& .MuiDataGrid-columnHeaderTitle": {
        whiteSpace: "normal", // Ensure text wraps
        lineHeight: "normal", // Adjust line height for better wrapping
      },
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "none",
      backgroundColor: "#0A6E7C",
      color: "white",
      borderRadius: "0 0 5px 5px",
    },
    "& .MuiCheckbox-root": {
      color: `#0A6E7C  !important`,
    },
    "& .css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar": {
      color: "white !important",
    },
    "& .css-1hgjne-MuiButtonBase-root-MuiIconButton-root.Mui-disabled": {
      color: "grey !important",
    },
    "& .MuiDataGrid-cell .MuiDataGrid-cell--textLeft": {
      color: "white !important",
    },
    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
      color: `#0A6E7C !important`,
    },
    "& .css-zz4ezo .MuiDataGrid-footerContainer": {
      borderRadius: "5px",
    },
  }}
>
  <AddNewEmployee />
  <DataGrid
    rows={manageTeam}
    columns={columns}
    components={{ Toolbar: GridToolbar }}
    onCellClick={handleCellClick}
  />
</Box>


      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Training and Certifications
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Certification Name"
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />
            <TextField
              label="Institution"
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />
            <TextField
              label="Date Acquired"
              fullWidth
              margin="normal"
              required
              variant="outlined"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Box mt={2} display="flex" justifyContent="space-between">
              <MUIButton type="submit" variant="contained" color="primary">
                Submit
              </MUIButton>
              <MUIButton onClick={handleCloseModal} variant="contained" color="secondary">
                Cancel
              </MUIButton>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default Contacts;
