

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// import EmployeeVcfDownload from './pages/employee/vcf';
import Home from './pages/Home';
import EmployeeDetail from "./pages/EmployeeDetail";
import Login from "./pages/Login";
import DesignationDetail from './pages/designationData/DesignationDetail';
import Post from './pages/postdata'
import Logout from './pages/Logout'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/designations" element={<DesignationDetail />} />
        {/* <Route path="/employee" element={<EmployeeVcfDownload />} /> */}
        <Route path="/employee/:id" element={<EmployeeDetail />} />
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </Router>
  );
};

export default App;
