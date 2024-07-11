// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getHrmsData } from "../../store/hrms";
// import { Link } from "react-router-dom";
// import "./Home.css";
// import Header from "../../components";
// import TemporaryDrawer from "./SideBar";

// import {
//   AppBar,
//   Toolbar,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";


// const Home = () => {
//   const dispatch = useDispatch();
//   const employeeData = useSelector((state) => state.hrms.data);
//   const isLoading = useSelector((state) => state.hrms.status);

//   useEffect(() => {
//     dispatch(getHrmsData());
//   }, [dispatch]);

//   return (
//     <div className="dashboard-container">
//       <AppBar position="static">
//         <Toolbar>
//           <Header />
//         </Toolbar>
//       </AppBar>
//       {isLoading === "pending" ? (
//         <div>Loading...</div>
//       ) : (
//         <>
//           <h1 className="dashboard-title">HRMS</h1>
//           <TableContainer component={Paper} className="table-container">
//             <Table aria-label="employee table">
//               <TableHead className="table-head">
//                 <TableRow>
//                   <TableCell>SL NO</TableCell>
//                   <TableCell>First Name</TableCell>
//                   <TableCell>Last Name</TableCell>
//                   <TableCell>Phone</TableCell>
//                   <TableCell>Email</TableCell>
//                   <TableCell>Designation</TableCell>
//                   <TableCell>Total Leaves</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {employeeData.map((data, index) => (
//                   <TableRow key={data.id} className="table-row">
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>
//                       <Link to={`/employee/${data.id}`}>{data.first_name}</Link>
//                     </TableCell>
//                     <TableCell>{data.last_name}</TableCell>
//                     <TableCell>{data.phone}</TableCell>
//                     <TableCell>{data.email}</TableCell>
//                     <TableCell>{data.designation_name}</TableCell>
//                     <TableCell>{data.total_leaves}</TableCell>    
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </>
//       )}
//     </div>
//   );
// };

// export default Home;



import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getHrmsData } from "../../store/hrms";
import { Link } from "react-router-dom";
import "./Home.css";
import Header from "../../components";
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
} from "@mui/material";

const Home = () => {
  const dispatch = useDispatch();
  const employeeData = useSelector((state) => state.hrms.data);
  const isLoading = useSelector((state) => state.hrms.status);

  useEffect(() => {
    dispatch(getHrmsData());
  }, [dispatch]);

  return (
    <div className="dashboard-container">
      <AppBar position="static">
        <Toolbar>
          <TemporaryDrawer />
          <Header />
        </Toolbar>
      </AppBar>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default Home;
