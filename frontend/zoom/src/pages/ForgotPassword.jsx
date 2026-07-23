import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    forgotPassword,
    verifyResetOTP,
    resetPassword,
  } = useAuth();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Send OTP
  const handleSendOTP = async () => {
    setError("");
    setMessage("");

    try {
      const res = await forgotPassword(email);

      setMessage(res.data.message);
      setStep(2);

    } catch (err) {
      console.log(err);

    setError(err.response?.data?.message || err.message);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    setError("");
    setMessage("");

    try {
      const res = await verifyResetOTP(email, otp);

      setMessage(res.data.message);
      setStep(3);

    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await resetPassword(email, password);

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/auth");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>

        <Typography variant="h4" gutterBottom>
          Forgot Password
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

        {step === 1 && (
          <>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleSendOTP}
            >
              Send OTP
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <TextField
              fullWidth
              label="OTP"
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleVerifyOTP}
            >
              Verify OTP
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <TextField
              fullWidth
              type="password"
              label="New Password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleResetPassword}
            >
              Update Password
            </Button>
          </>
        )}

        <Button
          sx={{ mt: 2 }}
          onClick={() => navigate("/auth")}
        >
          Back to Login
        </Button>

      </Box>
    </Container>
  );
};

export default ForgotPassword;