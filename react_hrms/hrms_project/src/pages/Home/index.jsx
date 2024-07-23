
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getHrmsData } from "../../store/hrms";
import { deleteEmployeeData } from "../../store/deleteEmployee";
import "./Home.css";
import Header from "../../components";
import Footer from "../../components/Footer";
import TemporaryDrawer from "./SideBar";
import {
  AppBar,
  Toolbar,
  Paper,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { useTheme } from '../../context/ThemeContext';
import { TableVirtuoso } from 'react-virtuoso';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employeeData = useSelector((state) => state.hrms.data);
  const isLoading = useSelector((state) => state.hrms.status);
  const username = useSelector((state) => state.auth.data);
  const [user, setUser] = useState(null);
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  console.log(employeeData,"employee data")
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/");
    }
    dispatch(getHrmsData());
  }, [dispatch, navigate, username]);

  const handleOpen = (id) => {
    setSelectedEmployeeId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployeeId(null);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteEmployeeData(selectedEmployeeId)).then(() => {
      dispatch(getHrmsData());
    });
    handleClose();
  };

  
  const isDarkMode = theme === 'dark';

  const rows = employeeData.map((data, index) => ({
    slno: index + 1,
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone,
    email: data.email,
    salary: data.salary,
    designation_name: data.designation_name,
    total_leaves: data.total_leaves,
    handleOpen: handleOpen,
  }));

  const columns = [
    
    {
      width: 150,
      label: 'First Name',
      dataKey: 'first_name',
    },
    {
      width: 150,
      label: 'Last Name',
      dataKey: 'last_name',
    },
    {
      width: 150,
      label: 'Phone',
      dataKey: 'phone',
    },
    {
      width: 200,
      label: 'Email',
      dataKey: 'email',
    },
    {
      width: 150,
      label: 'Designation',
      dataKey: 'designation_name',
    },
    {
      width: 100,
      label: 'Total Leaves',
      dataKey: 'total_leaves',
    },
    {
      width: 100,
      label: 'Actions',
      dataKey: 'actions',
    },
  ];
  
  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
    TableRow,
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
  };
  
  VirtuosoTableComponents.Scroller.displayName = 'VirtuosoScroller';
  VirtuosoTableComponents.Table.displayName = 'VirtuosoTable';
  VirtuosoTableComponents.TableHead.displayName = 'VirtuosoTableHead';
  VirtuosoTableComponents.TableBody.displayName = 'VirtuosoTableBody';
  
  function fixedHeaderContent() {
    return (
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align={column.dataKey === 'slno' || column.dataKey === 'actions' ? 'center' : 'left'}
            style={{ width: column.width }}
            sx={{
              backgroundColor: '#87CEFA',
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    );
  }
  
  function rowContent(_index, row) {
    return (
      <React.Fragment>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            align={column.dataKey === 'slno' || column.dataKey === 'actions' ? 'center' : 'left'}
          >
            {column.dataKey === 'actions' ? (
              <Button
                variant="contained"
                onClick={() => row.handleOpen(row.id)}
                sx={{
                  backgroundColor: "#80d8ff",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#87CEFA", 
                  },
                }}
              >
                Delete
              </Button>
            ) : column.dataKey === 'first_name' ? (
              <Link to={`/employee/${row.id}`} style={{ color: 'blue' }}>
                {row[column.dataKey]}
              </Link>
            ) : (
              row[column.dataKey]
            )}
          </TableCell>
        ))}
      </React.Fragment>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: isDarkMode ? '#121212' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <TemporaryDrawer />
          <Header />
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, mt: 20,ml:8,mr:8 }}>
        {isLoading === "pending" ? (
          <div>Loading...</div>
        ) : (
          <Paper style={{ height: 400, width: '100%' }}>
            <TableVirtuoso
              data={rows}
              components={VirtuosoTableComponents}
              fixedHeaderContent={fixedHeaderContent}
              itemContent={rowContent}
            />
          </Paper>
        )}
      </Box>
      <Footer />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this employee?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
