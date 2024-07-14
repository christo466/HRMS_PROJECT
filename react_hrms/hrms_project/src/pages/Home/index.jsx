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
import { useTheme } from '../../context/ThemeContext';

const Home = () => {
  const dispatch = useDispatch();
  const employeeData = useSelector((state) => state.hrms.data);
  const isLoading = useSelector((state) => state.hrms.status);
  const username = useSelector((state) => state.auth.data);
  const [user, setUser] = useState(null);
  const { theme } = useTheme();

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

  useEffect(() => {
    if (user) {
      dispatch(gethrData(user));
    }
  }, [user, dispatch]);

  const isDarkMode = theme === 'dark';

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
      <Box sx={{ flexGrow: 1, mt: 14 }}>
        {isLoading === "pending" ? (
          <div>Loading...</div>
        ) : (
          <>
            <TableContainer component={Paper} className="table-container">
              <Table aria-label="employee table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell sx={{ color: isDarkMode ? 'white' : 'black' }}>SL NO</TableCell>
                    <TableCell sx={{ color: isDarkMode ? 'white' : 'black' }}>First Name</TableCell>
                    <TableCell sx={{ color: isDarkMode ? 'white' : 'black' }}>Last Name</TableCell>
                    <TableCell sx={{ color: isDarkMode ? 'white' : 'black' }}>Phone</TableCell>
                    <TableCell sx={{ color: isDarkMode ? 'white' : 'black' }}>Email</TableCell>
                    <TableCell sx={{ color: isDarkMode ? 'white' : 'black' }}>Designation</TableCell>
                    <TableCell sx={{ color: isDarkMode ? 'white' : 'black' }}>Total Leaves</TableCell>
                    <TableCell sx={{ color: isDarkMode ? 'white' : 'black' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeData.map((data, index) => (
                    <TableRow
                      key={data.id}
                      className={`table-row ${isDarkMode ? 'dark-mode-row' : ''}`}
                      sx={{
                        backgroundColor: isDarkMode ? '#333' : 'inherit',
                        color: isDarkMode ? '#ffffff' : 'inherit',
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Link to={`/employee/${data.id}`} style={{ color: 'blue' }}>
                          {data.first_name}
                        </Link>
                      </TableCell>
                      <TableCell>{data.last_name}</TableCell>
                      <TableCell>{data.phone}</TableCell>
                      <TableCell>{data.email}</TableCell>
                      <TableCell>{data.designation_name}</TableCell>
                      <TableCell>{data.total_leaves}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => handleDelete(data.id)}
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





