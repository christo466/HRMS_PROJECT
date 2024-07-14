import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EmployeeDetail from "./pages/EmployeeDetail";
import Login from "./pages/Login";
import DesignationDetail from './pages/designationData/DesignationDetail';
import Post from './pages/postdata';
import Logout from './pages/Logout';
import About from './components/About';
import PrivacyPolicy from './components/PrivacyPolicy';
import { useTheme } from './context/ThemeContext';
import EmployeeChartPage from './pages/chart/EmployeeChart';


const App = () => {
  const { theme } = useTheme();

  React.useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="App">
      <Router>
        
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/designations" element={<DesignationDetail />} />
          <Route path="/employee/:id" element={<EmployeeDetail />} />
          <Route path="/" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/post" element={<Post />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/employeechart" element={<EmployeeChartPage/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
