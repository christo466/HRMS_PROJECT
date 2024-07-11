// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getDesignationData } from "../../store/designation";
// import { updateDesignation } from "../../store/updateDesignation";

// import Header from "../../components";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   CircularProgress,
//   TextField,
//   Button,
//   Modal,
// } from "@mui/material";
// import { postdesignationData } from "../../store/postDesignation";


// const DesignationDetail = () => {
//   const dispatch = useDispatch();
//   const designationData = useSelector((state) => state.designation.data);
//   const isLoading = useSelector((state) => state.designation.status);
//   const error = useSelector((state) => state.designation.error);
//   const [newDesignation, setNewDesignation] = useState({ name: "", leaves: "" });
//   const [editData, setEditData] = useState({  name: "", leaves: "" });
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     if (designationData.length === 0) {
//       dispatch(getDesignationData());
//     }
//   }, [dispatch, designationData]);

//   const handleAddDesignationChange = (e) => {
//     const { name, value } = e.target;
//     setNewDesignation((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSuccess = () => {
//     setErrorMsg(null);
//     setModalOpen(false);
//     setEditModalOpen(false);
//     dispatch(getDesignationData());
//   };

//   const handleError = (error) => {
//     setErrorMsg(error.message || "An error occurred while processing the request");
//   };

//   const handleAddDesignation = () => {
//     dispatch(postdesignationData({
//       data: newDesignation,
//       successCB: handleSuccess,
//       errorCB: handleError,
//     }));
//     setNewDesignation({ name: "", leaves: "" });
//   };

//   const handleUpdateDesignation = () => {
//     dispatch(updateDesignation({
//       data: editData,
//       successCB: handleSuccess,
      
//     }));
//   };

//   const handleOpenModal = () => {
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setErrorMsg(null);
//   };

//   const handleOpenEditModal = (designation) => {
//     setEditData(designation);
//     setEditModalOpen(true);
//   };

//   const handleCloseEditModal = () => {
//     setEditModalOpen(false);
//     setErrorMsg(null);
//   };

//   if (isLoading === "loading") {
//     return <div><CircularProgress /></div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <>
//       <AppBar position="static">
//         <Toolbar>
//           <Header />
//         </Toolbar>
//       </AppBar>
//       <Box mt={2} p={2}>
//         <Button variant="contained" onClick={handleOpenModal} style={{ marginBottom: '20px' }}>
//           Add New Designation
//         </Button>
//         <Modal
//           open={modalOpen}
//           onClose={handleCloseModal}
//           aria-labelledby="add-designation-modal"
//           aria-describedby="add-designation-modal-description"
//         >
//           <Box
//             sx={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               width: 400,
//               bgcolor: 'background.paper',
//               border: '2px solid #000',
//               boxShadow: 24,
//               p: 4,
//             }}
//           >
//             <Typography variant="h6" component="h2">
//               Add New Designation
//             </Typography>
//             {errorMsg && (
//               <Typography color="error" variant="body2">
//                 {errorMsg}
//               </Typography>
//             )}
//             <TextField
//               name="name"
//               label="Designation"
//               value={newDesignation.name}
//               onChange={handleAddDesignationChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               name="leaves"
//               label="Leaves"
//               value={newDesignation.leaves}
//               onChange={handleAddDesignationChange}
//               fullWidth
//               margin="normal"
//             />
//             <Button
//               variant="contained"
//               onClick={handleAddDesignation}
//               style={{ marginTop: '20px' }}
//             >
//               Add Designation
//             </Button>
//           </Box>
//         </Modal>
//         <Modal
//           open={editModalOpen}
//           onClose={handleCloseEditModal}
//           aria-labelledby="edit-designation-modal"
//           aria-describedby="edit-designation-modal-description"
//         >
//           <Box
//             sx={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               width: 400,
//               bgcolor: 'background.paper',
//               border: '2px solid #000',
//               boxShadow: 24,
//               p: 4,
//             }}
//           >
//             <Typography variant="h6" component="h2">
//               Edit Designation
//             </Typography>
//             {errorMsg && (
//               <Typography color="error" variant="body2">
//                 {errorMsg}
//               </Typography>
//             )}
//             <TextField
//               name="name"
//               label="Designation"
//               value={editData.designation}
//               onChange={handleEditChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               name="leaves"
//               label="Leaves"
//               value={editData.leaves}
//               onChange={handleEditChange}
//               fullWidth
//               margin="normal"
//             />
//             <Button
//               variant="contained"
//               onClick={handleUpdateDesignation}
//               style={{ marginTop: '20px' }}
//             >
//               Update Designation
//             </Button>
//           </Box>
//         </Modal>
//         {designationData.map((designation) => (
//           <Box key={designation.id} mb={2} p={2} border={1} borderRadius={4}>
//             <Typography variant="h6">Designation: {designation.designation}</Typography>
//             <Typography variant="body1">Leaves: {designation.leaves}</Typography>
//             <Button
//               variant="contained"
//               onClick={() => handleOpenEditModal(designation)}
//               style={{ marginTop: '10px' }}
//             >
//               Edit Designation
//             </Button>
//           </Box>
//         ))}
//       </Box>
//     </>
//   );
// };

// export default DesignationDetail;





import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDesignationData } from "../../store/designation";
import { updateDesignation } from "../../store/updateDesignation";
import { deleteDesignation } from "../../store/deleteDesig";
import Header from "../../components";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Button,
  Modal,
} from "@mui/material";
import { postdesignationData } from "../../store/postDesignation";

const DesignationDetail = () => {
  const dispatch = useDispatch();
  const designationData = useSelector((state) => state.designation.data);
  const isLoading = useSelector((state) => state.designation.status);
  const error = useSelector((state) => state.designation.error);
  const [newDesignation, setNewDesignation] = useState({ name: "", leaves: "" });
  const [editData, setEditData] = useState({ id: null, name: "", leaves: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (designationData.length === 0) {
      dispatch(getDesignationData());
    }
  }, [dispatch, designationData]);

  const handleAddDesignationChange = (e) => {
    const { name, value } = e.target;
    setNewDesignation((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSuccess = () => {
    setErrorMsg(null);
    setModalOpen(false);
    setEditModalOpen(false);
    dispatch(getDesignationData());
  };

  const handleError = (error) => {
    setErrorMsg(error.message || "An error occurred while processing the request");
  };

  const handleAddDesignation = () => {
    dispatch(postdesignationData({
      data: newDesignation,
      successCB: handleSuccess,
      errorCB: handleError,
    }));
    setNewDesignation({ name: "", leaves: "" });
  };

  const handleUpdateDesignation = () => {
    dispatch(updateDesignation({
      data: editData,
      successCB: handleSuccess,
    }));
  };

  const handleDeleteDesignation = (id) => {
    dispatch(deleteDesignation({
      id: id,
      successCB: handleSuccess
     
    }));
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setErrorMsg(null);
  };

  const handleOpenEditModal = (designation) => {
    setEditData(designation);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setErrorMsg(null);
  };

  if (isLoading === "loading") {
    return <div><CircularProgress /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <Box mt={2} p={2}>
        <Button variant="contained" onClick={handleOpenModal} style={{ marginBottom: '20px' }}>
          Add New Designation
        </Button>
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="add-designation-modal"
          aria-describedby="add-designation-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              Add New Designation
            </Typography>
            {errorMsg && (
              <Typography color="error" variant="body2">
                {errorMsg}
              </Typography>
            )}
            <TextField
              name="name"
              label="Designation"
              value={newDesignation.name}
              onChange={handleAddDesignationChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="leaves"
              label="Leaves"
              value={newDesignation.leaves}
              onChange={handleAddDesignationChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={handleAddDesignation}
              style={{ marginTop: '20px' }}
            >
              Add Designation
            </Button>
          </Box>
        </Modal>
        <Modal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          aria-labelledby="edit-designation-modal"
          aria-describedby="edit-designation-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              Edit Designation
            </Typography>
            {errorMsg && (
              <Typography color="error" variant="body2">
                {errorMsg}
              </Typography>
            )}
            <TextField
              name="name"
              label="Designation"
              value={editData.designation}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="leaves"
              label="Leaves"
              value={editData.leaves}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={handleUpdateDesignation}
              style={{ marginTop: '20px' }}
            >
              Update Designation
            </Button>
          </Box>
        </Modal>
        {designationData.map((designation) => (
          <Box key={designation.id} mb={3} p={4} border={1} borderRadius={4} sx={{ width: '50%' }}>
            <Typography variant="h6">Designation: {designation.designation}</Typography>
            <Typography variant="body1">Leaves: {designation.leaves}</Typography>
            <Box    sx={{display: 'flex', justifyContent: 'space-between' }}   >
            <Button
              variant="contained"
              onClick={() => handleOpenEditModal(designation)}
              style={{ marginTop: '10px', marginRight: '10px' }}
            >
              Edit Designation
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteDesignation(designation.id)}
              style={{ marginTop: '10px' }}
            >
              Delete Designation
            </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default DesignationDetail;
