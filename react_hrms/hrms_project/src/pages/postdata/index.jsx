
import { useState } from "react";
import { useDispatch } from "react-redux";
import { postemployeeData  } from "../../store/postData";
import { useNavigate } from "react-router-dom";
import { Container, Box, TextField, Button, Typography } from "@mui/material";

const AddProductForm = () => {
  const [productData, setProductData] = useState({
    first_name: "",
    last_name: "",
    Address: "",
    phone: "",
    email:"",
    designation_id:""
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSuccess = () => {
    console.log("success");
    navigate("/home");
    setErrorMsg(null);
  };

  const handleError = (error) => {
    console.log("error success", error);
    setErrorMsg(error.error);
  };

  const handleSubmit = (e) => {
    console.log(productData)
    e.preventDefault();
    dispatch(
        postemployeeData ({
        data: productData,
        successCB: handleSuccess,
        errorCB: handleError,
      })
    );
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f8f9fa",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          padding: 4,
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Add New Employee
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="first_name"
            value={productData.first_name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Last name"
            name="last_name"
            value={productData.last_name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Address"
            name="Address"
            value={productData.Address}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="phone"
            name="phone"
            value={productData.phone}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="email"
            name="email"
            value={productData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Designation id"
            name="designation_id"
            value={productData.designation_id}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Add Product
          </Button>
          {errorMsg && (
            <Typography
              variant="body2"
              color="error"
              align="center"
              sx={{ mt: 2 }}
            >
              {errorMsg}
            </Typography>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default AddProductForm;



