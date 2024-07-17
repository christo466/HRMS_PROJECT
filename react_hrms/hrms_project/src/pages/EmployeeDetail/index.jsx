import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getHrmsData } from "../../store/hrms";
import { updateEmployee, updateLeavesTaken } from "../../store/updateEmployee";
import Header from "../../components";
import PropTypes from "prop-types";
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
  Stack,
  Tabs,
  Tab,
  Paper,
  styled,
} from "@mui/material";
import VCF from "vcf";
import QRCode from "qrcode.react";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import { blue, grey } from "@mui/material/colors";
import Footer from "../../components/Footer";
import TemporaryDrawer from "../Home/SideBar";

const tabData = [
  {
    label: "Employee Details",
    icon: <ListAltOutlinedIcon />,
  },
  {
    label: "Leaves Information",
    icon: <BuildCircleOutlinedIcon />,
  },
  {
    label: "QR Code",
    icon: <PaymentOutlinedIcon />,
  },
];

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const employeeData = useSelector((state) =>
    state.hrms.data.find((emp) => emp.id === parseInt(id))
  );
  const isLoading = useSelector((state) => state.hrms.status);
  const designations = useSelector((state) => state.designation.data);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    } else {
      if (!employeeData) {
        dispatch(getHrmsData());
      }
      dispatch(getDesignationData());
    }
  }, [dispatch, employeeData, navigate]);

  const [vcfData, setVcfData] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [leavesModalOpen, setLeavesModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [leavesData, setLeavesData] = useState(0);
  const [value, setValue] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [errorMsgEmployee, setErrorMsgEmployee] = useState(null);
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

  const handleError = (error) => {
    setErrorMsg(error.response.data.error);
  };
  const handleErrorEmployee = (error) => {
    setErrorMsgEmployee(error);
  };
  const handleEditOpen = () => {
    setEditData({
      ...employeeData,
      designation_id: employeeData.designation_id,
    });
    setEditModalOpen(true);
  };
 
  const handleEditClose = () => {
    setEditModalOpen(false);
  };

  const handleLeavesOpen = () => {
    setLeavesData(0);
    setLeavesModalOpen(true);
  };

  const handleLeavesClose = () => {
    setLeavesModalOpen(false);
    setErrorMsg(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };
  console.log(editData,"edit data")
  const handleLeavesChange = (e) => {
    const { value } = e.target;
    setLeavesData(value);
  };

  const handleSuccess = () => {
    handleRefresh();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateEmployee({
        data: editData,
        successCB: handleSuccess,
        errorCB:handleErrorEmployee
      })
    );
  };

  const saveLeavesTaken = (e) => {
    e.preventDefault();
    const newLeavesTaken = parseInt(leavesData);
    const remainingLeaves = employeeData.total_leaves - employeeData.leaves_taken;

    if (newLeavesTaken > remainingLeaves) {
      setErrorMsg("Leaves taken cannot exceed the Total leaves.");
      return;
    }

    dispatch(
      updateLeavesTaken({
        id: employeeData.id,
        data: newLeavesTaken + employeeData.leaves_taken,
        successCB: () => {
          handleSuccess();
          handleLeavesClose();
        },
        errorCB: handleError,
      })
    );
  };

  if (isLoading === "pending" || !employeeData) {
    return <div>Loading...</div>;
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <AppBar position="static">
        <Toolbar>
          <TemporaryDrawer />
          <Header />
        </Toolbar>
      </AppBar>
      <Stack direction="row" gap={2} flexGrow={1} padding={2}>
        <Tabs
          orientation="vertical"
          indicatorColor="primary"
          value={value}
          onChange={(_event, newValue) => setValue(newValue)}
          sx={{
            "& .MuiTabs-flexContainer": {
              gap: 1,
            },
          }}
        >
          {tabData.map((tab, index) => (
            <StyledTab
              key={index}
              label={
                <Stack direction="row" alignItems="center" gap={1}>
                  {tab.icon}
                  <Box>
                    <Typography whiteSpace="nowrap">{tab.label}</Typography>
                  </Box>
                </Stack>
              }
            />
          ))}
        </Tabs>
        <TabPanel value={value} index={0}>
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
              <Button
                variant="contained"
                onClick={handleEditOpen}
                style={{ marginTop: "10px", backgroundColor: "#40c4ff" }}
              >
                Edit Details
              </Button>
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">
                <strong>Total Leaves:</strong> {employeeData.total_leaves}
              </Typography>
              <Typography color="textSecondary">
                <strong>Leaves Taken:</strong> {employeeData.leaves_taken}
              </Typography>
              <Typography color="textSecondary">
                <strong>Remaining Leaves:</strong> {employeeData.total_leaves - employeeData.leaves_taken}
              </Typography>
              <Button
                variant="contained"
                onClick={handleLeavesOpen}
                style={{ marginLeft: "10px", backgroundColor: "#40c4ff" }}
              >
                Edit Leaves
              </Button>
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <EmployeeVcfDownload
            generateVcfAndUrl={generateVcfAndUrl}
            downloadVcf={downloadVcf}
            vcfData={vcfData}
          />
        </TabPanel>
      </Stack>
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
          {errorMsgEmployee && (
            <Typography color="error" variant="body2">
              {errorMsgEmployee}
            </Typography>
          )}
        </Box>
      </Modal>
      <Modal
        open={leavesModalOpen}
        onClose={handleLeavesClose}
        aria-labelledby="edit-leaves-modal"
        aria-describedby="edit-leaves-modal-description"
      >
        <Box sx={modalStyle}>
          <h2>Take Leaves</h2>
          <TextField
            name="leaves_taken"
            label="Enter Leaves"
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
          {errorMsg && (
            <Typography color="error" variant="body2">
              {errorMsg}
            </Typography>
          )}
        </Box>
      </Modal>
      <Footer />
    </Box>
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
        <Button variant="contained" onClick={downloadVcf} style={{ backgroundColor: "#40c4ff" }}>
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
          style={{ backgroundColor: "#40c4ff", width: "150px" }}
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

const StyledTab = styled(Tab)(({ theme }) => ({
  alignItems: "flex-start",
  border: "1px solid",
  borderColor: grey[300],
  textTransform: "none",
  backgroundColor: grey[50],
  borderRadius: "12px",
  padding: "24px",
  transition: "all 0.2s ease-in-out",
  "& p": {
    color: grey[600],
  },
  "& svg": {
    fontSize: 30,
    color: grey[500],
  },
  "&.Mui-selected, &:hover": {
    backgroundColor: "#fff",
    boxShadow: theme.shadows[6],
    "& p": {
      color: blue[500],
    },
    "& svg": {
      color: blue[400],
    },
  },
}));

EmployeeVcfDownload.propTypes = {
  generateVcfAndUrl: PropTypes.func.isRequired,
  downloadVcf: PropTypes.func.isRequired,
  vcfData: PropTypes.string.isRequired,
};





const TabPanel = ({ children, value, index }) => {
  return (
    value === index && (
      <Paper elevation={3} sx={{ p: 3, width: "60%", borderRadius: "12px", height: "50vh" }}>
        {children}
      </Paper>
    )
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
TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};
