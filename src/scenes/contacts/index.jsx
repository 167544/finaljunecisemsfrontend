import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import UpdateUserDetails from "./UpdateUserDetails";
import { Button } from "reactstrap";
import { useDispatch } from "react-redux";
import axios from "axios";
import setdata from "../../actions";
import AddNewEmployee from "./AddNewEmployee";

const Contacts = () => {
  const data = useSelector((state) => state.Empdata);
  const dispatch = useDispatch()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [manageTeam, setManageTeam] = useState([]);
  const [isupdate, setIsUpdated] = useState(0);
  const [columns, setColumns] = useState([]);



  const handleDelete = async (id) => {

    try {
      // Delete the record
      await axios.delete(`http://localhost:3004/deleteRecord/${id}`);

      // Fetch updated data
      const fetchDataResponse = await axios.get('http://localhost:3004/fetchdata');

      // Dispatch the fetched data
      dispatch(setdata(fetchDataResponse.data));
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    const dataWithIds = data.map((row) => ({ id: row._id, ...row }));
    setManageTeam(dataWithIds);

    // Define initial columns
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

      {
        field: "Customer Name",
        headerName: "Customer Name",
        headerAlign: "left",
        align: "left",
      },
      {
        field: "Contract Category",
        headerName: "Contract Category",
        flex: 1,
      },
      {
        field: "Country",
        headerName: "Country",
        flex: 1,
      },
      {
        field: "Location Descr",
        headerName: "Location Descr",
        flex: 1,
      },
      {
        field: "Resource Type",
        headerName: "Resource Type",
        flex: 1,
      },
      {
        field: "Manager Name",
        headerName: "Manager Name",
        flex: 1,
      },
      {
        field: "Category",
        headerName: "Category",
        flex: 1,
      },
      {
        field: "Primary Skill",
        headerName: "Primary Skill",
        flex: 1,
      },
      {
        field: "Skill Category for Primary Skill",
        headerName: "Skill Category for Primary Skill",
        flex: 1,
      },
      {
        field: "Skill Level for Primary Skill",
        headerName: "Skill Level for Primary Skill",
        flex: 1,
      },
      {
        field: "Secondary Skill",
        headerName: "Secondary Skill",
        flex: 1,
      },
      {
        field: "Skill Category for Secondary Skill",
        headerName: "Skill Category for Secondary Skill",
        flex: 1,
      },
      {
        field: "Tools Known",
        headerName: "Tools Known",
        flex: 1,
      },
      {
        field: "Update",
        headerName: "Update",

        flex: 2,
        renderCell: (params) => (
          <UpdateUserDetails
            id={params.row ? params.row["Employee ID"] : ""}
            haldleupdate={handleUpdate}
            style={{ margin: "10px" }}
          />
        ),
      },
      {
        field: "delete",
        headerName: "delete",
        flex: 2,
        renderCell: (params) => (
          <Button onClick={() => handleDelete(params.row['Employee ID'])}
          disabled={true}
          > 
          Delete 
          </Button>
        ),
      }
    ];

    setColumns(initialColumns);
  }, [data, isupdate]);

  const handleUpdate = () => {
    setIsUpdated((prevState) => prevState + 1);
  };

  const handleCellClick = (params) => {
    // Increase flex to 3 when a cell is clicked
    const updatedColumns = columns.map((column) => {
      if (column.field === params.field) {
        return { ...column, flex: 5 };
      } if (column.field === 'Update' || column.field === 'delete') {
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
          "& .name-column--cell": {
            color: "white",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#0A6E7C",
            borderBottom: "none",
            color: "white",
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
    </Box>

  );
};

export default Contacts;
