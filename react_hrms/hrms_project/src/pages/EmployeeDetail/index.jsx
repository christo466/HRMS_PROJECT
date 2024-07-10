

// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { getHrmsData } from "../../store/hrms";
// import Header from "../../components";
// import { AppBar, Toolbar } from "@mui/material";


// const EmployeeDetail = () => {
//     const { id } = useParams(); 
//     const dispatch = useDispatch(); 
//     const employeeData = useSelector((state) => state.hrms.data.find(emp => emp.id === parseInt(id))); 
//     const isLoading = useSelector((state) => state.hrms.status);
  
//     useEffect(() => {
//       if (!employeeData) {
//         dispatch(getHrmsData()); 
//       }
//     }, [dispatch, employeeData]); 
  
//     if (isLoading === "pending" || !employeeData) {
//       return <div>Loading...</div>; 
//     }
  
//     return (
//       <>
//         <AppBar position="static">
//           <Toolbar>
//             <Header /> 
//           </Toolbar>
//         </AppBar>
//         <div className="employee-detail-container">
//           <h1>{employeeData.first_name} {employeeData.last_name}</h1> 
//           <p><strong>Address:</strong> {employeeData.address}</p> 
//           <p><strong>Phone:</strong> {employeeData.phone}</p> 
//           <p><strong>Email:</strong> {employeeData.email}</p> 
//           <p><strong>Designation:</strong> {employeeData.designation_name}</p> 
//           <p><strong>Total Leaves:</strong> {employeeData.total_leaves}</p> 
//           <p><strong>Leaves Taken:</strong> {employeeData.leaves_taken}</p> 
//         </div>
//       </>
//     );
//   };
  
//   export default EmployeeDetail;
  




import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getHrmsData } from "../../store/hrms";
import Header from "../../components";
import { AppBar, Toolbar } from "@mui/material";
import VCF from 'vcf';
import QRCode from 'qrcode.react';

const EmployeeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const employeeData = useSelector((state) => state.hrms.data.find(emp => emp.id === parseInt(id)));
  const isLoading = useSelector((state) => state.hrms.status);

  useEffect(() => {
    if (!employeeData) {
      dispatch(getHrmsData());
    }
  }, [dispatch, employeeData]);

  const [vcfData, setVcfData] = useState('');

  const generateVcfAndUrl = () => {
    const employeeVcfData = generateVcfData(employeeData);
    setVcfData(employeeVcfData);
  };

  const generateVcfData = (employee) => {
    const vcard = new VCF();
    vcard.set('version', '3.0');
    vcard.set('fn', `${employee.first_name} ${employee.last_name}`);
    vcard.set('email', employee.email);
    vcard.set('tel', employee.phone);
    vcard.set('n', [employee.last_name, employee.first_name]); 
    return vcard.toString();
  };

  const downloadVcf = () => {
    if (vcfData) {
      const blob = new Blob([vcfData], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employee.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  if (isLoading === "pending" || !employeeData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <div className="employee-detail-container">
        <h1>{employeeData.first_name} {employeeData.last_name}</h1>
        <p><strong>Address:</strong> {employeeData.address}</p>
        <p><strong>Phone:</strong> {employeeData.phone}</p>
        <p><strong>Email:</strong> {employeeData.email}</p>
        <p><strong>Designation:</strong> {employeeData.designation_name}</p>
        <p><strong>Total Leaves:</strong> {employeeData.total_leaves}</p>
        <p><strong>Leaves Taken:</strong> {employeeData.leaves_taken}</p>
      </div>
      <EmployeeVcfDownload 
        generateVcfAndUrl={generateVcfAndUrl} 
        downloadVcf={downloadVcf} 
        vcfData={vcfData} 
      />
    </>
  );
};

const EmployeeVcfDownload = ({ generateVcfAndUrl, downloadVcf, vcfData }) => {
  const [showQRCode, setShowQRCode] = useState(false);

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  return (
    <>
      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        <button onClick={downloadVcf}>
          Download
        </button>
      </div>
      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        <button onClick={() => { toggleQRCode(); generateVcfAndUrl(); }}>
          {showQRCode ? "Close QR Code" : "View QR Code"}
        </button>
      </div>
      {showQRCode && vcfData && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ textAlign: 'center' }}>
            <QRCode value={`BEGIN:VCARD\n${vcfData}\nEND:VCARD`} />
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeDetail;
