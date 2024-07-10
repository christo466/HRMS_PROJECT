import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDesignationData } from "../../store/designation";
import Header from "../../components";
import { AppBar, Toolbar, Typography, Box, CircularProgress } from "@mui/material";

const DesignationDetail = () => {
    const dispatch = useDispatch(); 
    const designationData = useSelector((state) => state.designation.data);
    const isLoading = useSelector((state) => state.designation.status);
    const error = useSelector((state) => state.designation.error);

    useEffect(() => {
      if (designationData.length === 0) {
        dispatch(getDesignationData()); 
      }
    }, [dispatch, designationData]); 

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
          {designationData.map((designation) => (
            <Box key={designation.id} mb={2} p={2} border={1} borderRadius={4}>
              <Typography variant="h6">Designation: {designation.designation}</Typography>
              <Typography variant="body1">Leaves: {designation.leaves}</Typography>
            </Box>
          ))}
        </Box>
      </>
    );
};

export default DesignationDetail;
