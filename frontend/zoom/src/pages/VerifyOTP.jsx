import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const navigate = useNavigate();
 const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

 const handleSendOTP = async () => {
    try {
      setError("");
      setMessage("");

      const res = await axios.post("http://localhost:8000/send_otp", {
        email,
      });

      setMessage(res.data.message);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8000/verify_otp",
        {
          email,
          otp,
        }
      );

      setMessage(response.data.message);

// Save login token
localStorage.setItem("Token", response.data.Token);

setTimeout(() => {
  navigate("/home");
}, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "OTP Verification Failed"
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>

        <Typography variant="h4" gutterBottom>
          Verify Email
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleVerify}>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <TextField
            fullWidth
            label="OTP"
            margin="normal"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            required
          />

          {!otpSent ? (
          <Button
            fullWidth
            variant="contained"
            onClick={handleSendOTP}
          >
            Send OTP
          </Button>
        ) : (
          <>
            
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleVerify}
            >
              Verify OTP
            </Button>
          </>
        )}

        </form>
      </Box>
    </Container>
  );
};

export default VerifyOTP;