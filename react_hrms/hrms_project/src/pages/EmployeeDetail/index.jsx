// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { getHrmsData } from "../../store/hrms";
// import { updateEmployee, updateLeavesTaken } from "../../store/updateEmployee";
// import Header from "../../components";
// import { getDesignationData } from "../../store/designation";
// import {
//   AppBar,
//   Toolbar,
//   Button,
//   Modal,
//   Box,
//   TextField,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
// } from "@mui/material";
// import VCF from "vcf";
// import QRCode from "qrcode.react";

// const EmployeeDetail = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const employeeData = useSelector((state) =>
//     state.hrms.data.find((emp) => emp.id === parseInt(id))
//   );
//   const isLoading = useSelector((state) => state.hrms.status);
//   const designations = useSelector((state) => state.designation.data);

//   useEffect(() => {
//     if (!employeeData) {
//       dispatch(getHrmsData());
//     }
//     dispatch(getDesignationData()); // Fetch designations
//   }, [dispatch, employeeData]);

//   const [vcfData, setVcfData] = useState("");
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [leavesModalOpen, setLeavesModalOpen] = useState(false);
//   const [editData, setEditData] = useState({});
//   const [leavesData, setLeavesData] = useState(employeeData?.leaves_taken || 0);

//   const generateVcfAndUrl = () => {
//     const employeeVcfData = generateVcfData(employeeData);
//     setVcfData(employeeVcfData);
//   };

//   const generateVcfData = (employee) => {
//     const vcard = new VCF();
//     vcard.set("version", "3.0");
//     vcard.set("fn", `${employee.first_name} ${employee.last_name}`);
//     vcard.set("email", employee.email);
//     vcard.set("tel", employee.phone);
//     vcard.set("n", [employee.last_name, employee.first_name]);
//     return vcard.toString();
//   };

//   const downloadVcf = () => {
//     generateVcfAndUrl();
//     if (vcfData) {
//       const blob = new Blob([vcfData], { type: "text/vcard" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "employee.vcf";
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     }
//   };

//   const handleEditOpen = () => {
//     setEditData(employeeData);
//     setEditModalOpen(true);
//   };

//   const handleEditClose = () => {
//     setEditModalOpen(false);
//   };

//   const handleLeavesOpen = () => {
//     setLeavesData(employeeData?.leaves_taken || 0);
//     setLeavesModalOpen(true);
//   };

//   const handleLeavesClose = () => {
//     setLeavesModalOpen(false);
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData({ ...editData, [name]: value });
//   };

//   const handleLeavesChange = (e) => {
//     const { value } = e.target;
//     setLeavesData(value);
//   };

//   const handleSuccess = () => {
//     console.log("success");
//     handleRefresh();
//   };

//   const handleRefresh = () => {
//     window.location.reload();
//   };

//   const handleSubmit = (e) => {
//     console.log(editData);
//     e.preventDefault();
//     dispatch(
//       updateEmployee({
//         data: editData,
//         successCB: handleSuccess,
//         // errorCB: handleError,
//       })
//     );
//   };

//   const saveLeavesTaken = (e) => {
//     e.preventDefault();
//     dispatch(
//       updateLeavesTaken({
//         id: employeeData.id,
//         data: leavesData,
//         successCB: handleSuccess,
//       })
//     );
//     handleLeavesClose();
//   };

//   if (isLoading === "pending" || !employeeData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <AppBar position="static">
//         <Toolbar>
//           <Header />
//         </Toolbar>
//       </AppBar>
//       <div className="employee-detail-container">
//         <h1>
//           {employeeData.first_name} {employeeData.last_name}
//         </h1>
//         <p>
//           <strong>Address:</strong> {employeeData.address}
//         </p>
//         <p>
//           <strong>Phone:</strong> {employeeData.phone}
//         </p>
//         <p>
//           <strong>Email:</strong> {employeeData.email}
//         </p>
//         <p>
//           <strong>Designation:</strong> {employeeData.designation_name}
//         </p>
//         <p>
//           <strong>Total Leaves:</strong> {employeeData.total_leaves}
//         </p>
//         <p>
//           <strong>Leaves Remaining:</strong>{" "}
//           {employeeData.total_leaves - employeeData.leaves_taken}
//         </p>
//         <p>
//           <strong>Leaves Taken:</strong> {employeeData.leaves_taken}
//           <Button
//             variant="contained"
//             onClick={handleLeavesOpen}
//             style={{ marginLeft: "10px" }}
//           >
//             Edit Leaves
//           </Button>
//         </p>
//         <Button variant="contained" onClick={handleEditOpen}>
//           Edit Details
//         </Button>
//       </div>
//       <EmployeeVcfDownload
//         generateVcfAndUrl={generateVcfAndUrl}
//         downloadVcf={downloadVcf}
//         vcfData={vcfData}
//       />
//       <Modal
//         open={editModalOpen}
//         onClose={handleEditClose}
//         aria-labelledby="edit-employee-modal"
//         aria-describedby="edit-employee-modal-description"
//       >
//         <Box sx={{ ...modalStyle }}>
//           <h2>Edit Employee Details</h2>
//           <TextField
//             name="first_name"
//             label="First Name"
//             value={editData.first_name || ""}
//             onChange={handleEditChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="last_name"
//             label="Last Name"
//             value={editData.last_name || ""}
//             onChange={handleEditChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="address"
//             label="Address"
//             value={editData.address || ""}
//             onChange={handleEditChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="phone"
//             label="Phone"
//             value={editData.phone || ""}
//             onChange={handleEditChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             name="email"
//             label="Email"
//             value={editData.email || ""}
//             onChange={handleEditChange}
//             fullWidth
//             margin="normal"
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel id="designation-select-label">Designation</InputLabel>
//             <Select
//               labelId="designation-select-label"
//               name="designation_id"
//               value={editData.designation_id || ""}
//               onChange={handleEditChange}
//               label="Designation"
//             >
//               {designations.map((designation) => (
//                 <MenuItem key={designation.id} value={designation.id}>
//                   {designation.designation}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             style={{ marginTop: "20px" }}
//           >
//             Save
//           </Button>
//         </Box>
//       </Modal>
//       <Modal
//         open={leavesModalOpen}
//         onClose={handleLeavesClose}
//         aria-labelledby="edit-leaves-modal"
//         aria-describedby="edit-leaves-modal-description"
//       >
//         <Box sx={{ ...modalStyle }}>
//           <h2>Edit Leaves Taken</h2>
//           <TextField
//             name="leaves_taken"
//             label="Leaves Taken"
//             type="number"
//             value={leavesData}
//             onChange={handleLeavesChange}
//             fullWidth
//             margin="normal"
//           />
//           <Button
//             variant="contained"
//             onClick={saveLeavesTaken}
//             style={{ marginTop: "20px" }}
//           >
//             Save
//           </Button>
//         </Box>
//       </Modal>
//     </>
//   );
// };

// const EmployeeVcfDownload = ({ generateVcfAndUrl, downloadVcf, vcfData }) => {
//   const [showQRCode, setShowQRCode] = useState(false);

//   const toggleQRCode = () => {
//     setShowQRCode(!showQRCode);
//   };

//   return (
//     <>
//       <div style={{ textAlign: "left", marginTop: "20px" }}>
//         <button onClick={downloadVcf}>Download</button>
//       </div>
//       <div style={{ textAlign: "left", marginTop: "20px" }}>
//         <button
//           onClick={() => {
//             toggleQRCode();
//             generateVcfAndUrl();
//           }}
//         >
//           {showQRCode ? "Close QR Code" : "View QR Code"}
//         </button>
//       </div>
//       {showQRCode && vcfData && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "50vh",
//           }}
//         >
//           <div style={{ textAlign: "center" }}>
//             <QRCode value={`BEGIN:VCARD\n${vcfData}\nEND:VCARD`} />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

// export default EmployeeDetail;






import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getHrmsData } from "../../store/hrms";
import { updateEmployee, updateLeavesTaken } from "../../store/updateEmployee";
import Header from "../../components"; // Adjust import path as necessary
import { getDesignationData } from "../../store/designation";
import {
  AppBar,
  Toolbar,
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import VCF from "vcf";
import QRCode from "qrcode.react";

const EmployeeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const employeeData = useSelector((state) =>
    state.hrms.data.find((emp) => emp.id === parseInt(id))
  );
  const isLoading = useSelector((state) => state.hrms.status);
  const designations = useSelector((state) => state.designation.data);

  useEffect(() => {
    if (!employeeData) {
      dispatch(getHrmsData());
    }
    dispatch(getDesignationData()); // Fetch designations
  }, [dispatch, employeeData]);

  const [vcfData, setVcfData] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [leavesModalOpen, setLeavesModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [leavesData, setLeavesData] = useState(employeeData?.leaves_taken || 0);

  const generateVcfAndUrl = () => {
    const employeeVcfData = generateVcfData(employeeData);
    setVcfData(employeeVcfData);
  };

  const generateVcfData = (employee) => {
    const vcard = new VCF();
    vcard.set("version", "3.0");
    vcard.set("fn", `${employee.first_name} ${employee.last_name}`);
    vcard.set("email", employee.email);
    vcard.set("tel", employee.phone);
    vcard.set("n", [employee.last_name, employee.first_name]);
    return vcard.toString();
  };

  const downloadVcf = () => {
    generateVcfAndUrl();
    if (vcfData) {
      const blob = new Blob([vcfData], { type: "text/vcard" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "employee.vcf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleEditOpen = () => {
    setEditData(employeeData);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
  };

  const handleLeavesOpen = () => {
    setLeavesData(employeeData?.leaves_taken || 0);
    setLeavesModalOpen(true);
  };

  const handleLeavesClose = () => {
    setLeavesModalOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleLeavesChange = (e) => {
    const { value } = e.target;
    setLeavesData(value);
  };

  const handleSuccess = () => {
    console.log("success");
    handleRefresh();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSubmit = (e) => {
    console.log(editData);
    e.preventDefault();
    dispatch(
      updateEmployee({
        data: editData,
        successCB: handleSuccess,
        // errorCB: handleError,
      })
    );
  };

  const saveLeavesTaken = (e) => {
    e.preventDefault();
    dispatch(
      updateLeavesTaken({
        id: employeeData.id,
        data: leavesData,
        successCB: handleSuccess,
      })
    );
    handleLeavesClose();
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
      <div className="employee-detail-container" style={{ padding: "20px" }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              {employeeData.first_name} {employeeData.last_name}
            </Typography>
            <Typography color="textSecondary">
              <strong>Address:</strong> {employeeData.address}
            </Typography>
            <Typography color="textSecondary">
              <strong>Phone:</strong> {employeeData.phone}
            </Typography>
            <Typography color="textSecondary">
              <strong>Email:</strong> {employeeData.email}
            </Typography>
            <Typography color="textSecondary">
              <strong>Designation:</strong> {employeeData.designation_name}
            </Typography>
            <Typography color="textSecondary">
              <strong>Total Leaves:</strong> {employeeData.total_leaves}
            </Typography>
            <Typography color="textSecondary">
              <strong>Leaves Remaining:</strong>{" "}
              {employeeData.total_leaves - employeeData.leaves_taken}
            </Typography>
            <Typography color="textSecondary">
              <strong>Leaves Taken:</strong> {employeeData.leaves_taken}
              <Button
                variant="contained"
                onClick={handleLeavesOpen}
                style={{ marginLeft: "10px" }}
              >
                Edit Leaves
              </Button>
            </Typography>
            <Button
              variant="contained"
              onClick={handleEditOpen}
              style={{ marginTop: "10px" }}
            >
              Edit Details
            </Button>
          </CardContent>
        </Card>
      </div>
      <EmployeeVcfDownload
        generateVcfAndUrl={generateVcfAndUrl}
        downloadVcf={downloadVcf}
        vcfData={vcfData}
      />
      <Modal
        open={editModalOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-employee-modal"
        aria-describedby="edit-employee-modal-description"
      >
        <Box sx={modalStyle}>
          <h2>Edit Employee Details</h2>
          <TextField
            name="first_name"
            label="First Name"
            value={editData.first_name || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="last_name"
            label="Last Name"
            value={editData.last_name || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="address"
            label="Address"
            value={editData.address || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="phone"
            label="Phone"
            value={editData.phone || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="email"
            label="Email"
            value={editData.email || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="designation-select-label">Designation</InputLabel>
            <Select
              labelId="designation-select-label"
              name="designation_id"
              value={editData.designation_id || ""}
              onChange={handleEditChange}
              label="Designation"
            >
              {designations.map((designation) => (
                <MenuItem key={designation.id} value={designation.id}>
                  {designation.designation}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{ marginTop: "20px" }}
          >
            Save
          </Button>
        </Box>
      </Modal>
      <Modal
        open={leavesModalOpen}
        onClose={handleLeavesClose}
        aria-labelledby="edit-leaves-modal"
        aria-describedby="edit-leaves-modal-description"
      >
        <Box sx={modalStyle}>
          <h2>Edit Leaves Taken</h2>
          <TextField
            name="leaves_taken"
            label="Leaves Taken"
            type="number"
            value={leavesData}
            onChange={handleLeavesChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={saveLeavesTaken}
            style={{ marginTop: "20px" }}
          >
            Save
          </Button>
        </Box>
      </Modal>
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
      <div style={{ textAlign: "left", marginTop: "20px" }}>
        <Button variant="contained" onClick={downloadVcf}>
          Download VCF
        </Button>
      </div>
      <div style={{ textAlign: "left", marginTop: "20px" }}>
        <Button
          variant="contained"
          onClick={() => {
            toggleQRCode();
            generateVcfAndUrl();
          }}
        >
          {showQRCode ? "Close QR Code" : "View QR Code"}
        </Button>
      </div>
      {showQRCode && vcfData && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <QRCode value={`BEGIN:VCARD\n${vcfData}\nEND:VCARD`} />
          </div>
        </div>
      )}
    </>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default EmployeeDetail;
