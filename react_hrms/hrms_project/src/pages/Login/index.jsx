import  { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { loginUser  } from "../../store/login";
import { useNavigate } from "react-router-dom";



const Login = () => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth.error);
  const isLoading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();

  const handleSuccess = () => {
    console.log("success");
    navigate("/home");
    
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      dispatch(loginUser({
        username: username,
        password:password,
        successCB: handleSuccess,
        
      }));
    }
  };

  return (
    <> 
    
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          HR Login
        </Typography>
        {authError && <Typography color="error">{authError}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Box>
    </Container>
    
    </>
  );
};

export default Login;
