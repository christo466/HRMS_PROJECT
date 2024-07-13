import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getHrmsData } from "../../store/hrms";
import { deleteEmployeeData } from "../../store/deleteEmployee";
import { gethrData } from "../../store/hr";
import { Link } from "react-router-dom";
import "./Home.css";
import Header from "../../components";
import Footer from "../../components/Footer"; 
import TemporaryDrawer from "./SideBar";
import {
  AppBar,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";

const Home = () => {
  const dispatch = useDispatch();
  const employeeData = useSelector((state) => state.hrms.data);
  const isLoading = useSelector((state) => state.hrms.status);
  const username = useSelector((state) => state.auth.data);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    dispatch(getHrmsData());
  }, [dispatch, username]);

  const handleDelete = (id) => {
    dispatch(deleteEmployeeData(id)).then(() => {
      dispatch(getHrmsData());
    });
  };
  console.log("location data", user);
  useEffect(() => {
    if (user) {
      dispatch(gethrData(user));
    }
  }, [user, dispatch]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <TemporaryDrawer />
          <Header />
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1 }}>
        {isLoading === "pending" ? (
          <div>Loading...</div>
        ) : (
          <>
            <h1 className="dashboard-title">HRMS</h1>
            <TableContainer component={Paper} className="table-container">
              <Table aria-label="employee table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell>SL NO</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Designation</TableCell>
                    <TableCell>Total Leaves</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeData.map((data, index) => (
                    <TableRow key={data.id} className="table-row">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Link to={`/employee/${data.id}`}>{data.first_name}</Link>
                      </TableCell>
                      <TableCell>{data.last_name}</TableCell>
                      <TableCell>{data.phone}</TableCell>
                      <TableCell>{data.email}</TableCell>
                      <TableCell>{data.designation_name}</TableCell>
                      <TableCell>{data.total_leaves}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDelete(data.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;





