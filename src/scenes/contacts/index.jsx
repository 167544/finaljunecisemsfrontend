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
          color: "white", // Set the font color to white
          fontSize: "16px", // Increase font size for readability
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
    handleCloseModal();
  };

  useEffect(() => {
    const dataWithIds = data.map((row) => ({ id: row._id, ...row }));
    setManageTeam(dataWithIds);

    const initialColumns = [
      { field: "Employee ID", headerName: "Emp ID", width: 150, renderCell: (params) => <ScrollableCell value={params.value} />, hideable: false },
      { field: "Employee Name", headerName: "Emp Name", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable: false },
      { field: "Band", headerName: "Band", width: 100, renderCell: (params) => <ScrollableCell value={params.value} />, hideable: false },
      {
        field: "Resource with Valid VISA",
        headerName: "Resource with Valid VISA",
        width: 200,
        renderCell: (params) => <ScrollableCell value={params.value} />,
        hide: true,
      },
      { field: "Account Name", headerName: "Account Name", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable: false },
      { field: "Contract Category", headerName: "Contract Category", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hide: true },
      { field: "Country", headerName: "Country", width: 150, renderCell: (params) => <ScrollableCell value={params.value} />, hideable: false },
      { field: "Location Descr", headerName: "Location Descr", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hide: true },
      { field: "Resource Type", headerName: "Resource Type", width: 150, renderCell: (params) => <ScrollableCell value={params.value} />, hideable: false },
      { field: "Manager Name", headerName: "Manager Name", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable: false },
      { field: "Category", headerName: "Category", width: 150, renderCell: (params) => <ScrollableCell value={params.value} />, hideable: false },
      {
        field: "Primary Skill",
        headerName: "Primary Skill",
        width: 200,
        renderCell: (params) => <ScrollableCell value={params.value} />,
        hideable: false,
      },
      { field: "Skill Level for Primary Skill", headerName: "Primary Skill Level", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hide: true },
      { field: "Secondary Skill", headerName: "Secondary Skill", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable: false },
      { field: "Skill Category for Secondary Skill", headerName: "Secondary Skill Category", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hide: true},
      { field: "Detailed Skill", headerName: "Detailed Skill", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable: false },
      { field: "Tertiary Skill", headerName: "Tertiary Skill", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable: false },
      { field: "Tools Known", headerName: "Tools Known", width: 200, renderCell: (params) => <ScrollableCell value={params.value} />, hideable: false },
      {
        field: "Last Updated Date",
        headerName: "Last Updated Date",
        width: 200,
        renderCell: (params) => (
          <ScrollableCell value={format(new Date(params.value), "dd/MM/yyyy")} />
        ), hide: true
      },
      {
        field: "Update",
        headerName: "Update",
        width: 150,
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
        width: 200,
        renderCell: (params) => (
          <MUIButton
            onClick={() => handleOpenModal(params.row)}
            disabled={false}
            sx={{ backgroundColor: "#0A2342", color: "white", "&:hover": { backgroundColor: "#062A5C" } }}
          >
            T and C
          </MUIButton>
        ),
        hide: true
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
        return { ...column, width: column.width + 50 }; // Increase width on click
      }
      return column;
    });
    setColumns(updatedColumns);
  };

  return (
    <Box m="20px">
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          paddingBottom: "20px", // Add padding to the bottom
          "& .MuiDataGrid-root": {
            border: "2px solid #0A2342", // Add border to the DataGrid
            backgroundColor: "#0A2342",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #0A2342", // Add border to the cells
            color: "white", // Set font color to white
            fontSize: "16px", // Increase the font size for readability
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#0A2342",
            borderBottom: "1px solid #0A2342", // Add border to the bottom of the header
            color: "white", // Set font color to white
            height: "70px", // Increase header height
            padding: "20px", // Increase padding for larger header
            "& .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "normal", // Ensure text wraps
              lineHeight: "normal", // Adjust line height for better wrapping
            },
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #0A2342", // Add border to the top of the footer
            backgroundColor: "#0A2342",
            color: "white", // Set font color to white
            borderRadius: "0 0 5px 5px",
            marginTop: "20px", // Add margin to the top
          },
          "& .MuiCheckbox-root": {
            color: `#0A2342  !important`,
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
            color: `white !important`,
          },
          "& .css-zz4ezo .MuiDataGrid-footerContainer": {
            borderRadius: "5px",
          },
          "& .MuiDataGrid-toolbarContainer button": {
            color: "white !important", // Set toolbar button text color to white
          },
          "& .MuiDataGrid-toolbarContainer": {
            backgroundColor: "#0A2342", // Set toolbar background color
            color: "white !important", // Set toolbar text color to white
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
