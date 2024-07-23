import  { useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useDispatch, useSelector } from 'react-redux';
import { getHrmsData } from '../../store/hrms';
import Footer from '../../components/Footer';
import Header from '../../components';
import {
  AppBar,
  Toolbar,
  Box,
 
} from "@mui/material";
import { useTheme } from '../../context/ThemeContext';
import TemporaryDrawer from '../Home/SideBar';
export default function BasicArea() {
  const dispatch = useDispatch();

  // Select HRMS data from the Redux store
  const hrmsData = useSelector((state) => state.hrms.data);
  const isLoading = useSelector((state) => state.hrms.isLoading);
  const error = useSelector((state) => state.hrms.error);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  useEffect(() => {
    // Dispatch the action to fetch HRMS data when the component mounts
    dispatch(getHrmsData());
  }, [dispatch]);


  // Ensure hrmsData is an array before mapping
  const xAxisData = Array.isArray(hrmsData) ? hrmsData.map((item) => item.first_name) : [];
  const seriesData = Array.isArray(hrmsData) ? hrmsData.map((item) => item.salary) : [];

 

  // Conditional rendering based on loading state and data presence
  return (
    <>
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "80vh",
          width: "100%",
        }}
      >
    {/* <div> */}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading data: {error}</p>}
      {!isLoading && !error && hrmsData.length > 0 && (
        <LineChart
          xAxis={[{data:xAxisData, scaleType: 'point'}]} 
          series={[
            {
              data: seriesData,
              label: "Salary",
              area: true,
            },
          ]}
          width={1000}
          height={600}
        />
      )}
    {/* </div> */}
    </Box>
    </Box>
    <Footer/>
    </>
  );
}
