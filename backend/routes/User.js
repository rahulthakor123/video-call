// routes/User.js
import { Router } from "express";
import {
  addToHistory,
  register,
  login,
  getUserHistory,
  createMeeting,
  verifyOTP,
  sendOTPAgain,
  forgotPassword,
  verifyResetOTP,
  resetPassword
} from "../controller/User.js";

const router = Router();

router.post("/register", register);
router.post("/send_otp", sendOTPAgain);
router.post("/verify_otp", verifyOTP);
router.post("/login", login);
router.route("/add_to_activity").post(addToHistory);
router.route("/get_all_activity").get(getUserHistory);
router.post("/create_meeting", createMeeting);
router.post("/forgot_password", forgotPassword);
router.post("/verify_reset_otp", verifyResetOTP);
router.post("/reset_password", resetPassword);
export default router;
