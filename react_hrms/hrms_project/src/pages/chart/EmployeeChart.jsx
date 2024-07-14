import  { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Paper, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getHrmsData } from '../../store/hrms';
import Header from '../../components';
import {
    AppBar,
    Toolbar,
} from '@mui/material';
import TemporaryDrawer from '../Home/SideBar';
import Footer from '../../components/Footer';


ChartJS.register(ArcElement, Tooltip, Legend);


import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const EmployeeChartPage = () => {
  const dispatch = useDispatch();
  const employeeData = useSelector((state) => state.hrms.data);
  const isLoading = useSelector((state) => state.hrms.status);

  useEffect(() => {
    dispatch(getHrmsData());
  }, [dispatch]);


  const designationCounts = {};
  employeeData.forEach((employee) => {
    const designation = employee.designation_name;
    if (designationCounts[designation]) {
      designationCounts[designation]++;
    } else {
      designationCounts[designation] = 1;
    }
  });


  const chartData = {
    labels: Object.keys(designationCounts),
    datasets: [
      {
        label: 'Employee Count by Designation',
        data: Object.values(designationCounts),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#F7464A',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#F7464A',
        ],
      },
    ],
  };


  if (isLoading === 'pending') {
    return <div>Loading...</div>;
  }


  if (!employeeData || employeeData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <PageContainer>
      <AppBar position="static">
        <Toolbar>
          <TemporaryDrawer />
          <Header />
        </Toolbar>
      </AppBar>
      <ContentWrapper>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '20px', width: '100%', maxWidth: '600px' }}>
          <Typography variant="h4" style={{ marginBottom: '10px' }}>
            Employee Count by Designation
          </Typography>
          <Doughnut data={chartData} />
        </Paper>
      </ContentWrapper>
      <Footer />
    </PageContainer>
  );
};

export default EmployeeChartPage;
