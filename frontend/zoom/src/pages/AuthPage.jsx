import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { VideoMeetPage } from './VideoMeetPage';
import { useNavigate } from 'react-router-dom';



import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack,
  Snackbar,
  colors,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { red } from '@mui/material/colors';


const CredentialsSignInPage = () => {
  const navigate=useNavigate();
  const {
    username,
    name,
    password,
    setUsername,
    setName,
    setPassword,
    handleLogin,
    handleRegister,
  } = useAuth();

  const [formState, setFormState] = useState(0); // 0 = Sign In, 1 = Sign Up
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setOpen(false);



    const payload = {
      Username: username,
      Password: password,
      Name: name,
    };

  try {
    if (formState === 0) {
      await handleLogin(payload);
      if (!username) {
        setError("User not found");
        return;
      }
      setMessage('Signed in successfully!');
      setOpen(true);
      navigate("/home"); 
    } else {
      await handleRegister(payload);
      setMessage('Registered successfully!');
      setOpen(true);
      navigate("/home"); 
    }
  } catch (err) {
    console.log(err);
    setError('Something went wrong. Please try again.');
  }
};

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          {formState === 0 ? 'Sign In' : 'Sign Up'}
        </Typography>

        {message && (
          <Alert
            icon={<CheckCircleIcon fontSize="inherit" />}
            severity="success"
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant={formState === 0 ? 'contained' : 'outlined'}
              onClick={() => setFormState(0)}
            >
              Sign In
            </Button>
            <Button
              variant={formState === 1 ? 'contained' : 'outlined'}
              onClick={() => setFormState(1)}
            >
              Sign Up
            </Button>
          </Stack>

          {formState === 1 && (
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
          )}

          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <p style={{ color: red }}>{error}</p>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            {formState === 0 ? 'Login In' : 'Register'}
          </Button>

        </form>
      </Box>


      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={message}
      />
    </Container>
  );
};

export default CredentialsSignInPage;



//work on free time
