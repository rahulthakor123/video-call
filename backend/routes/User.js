// routes/User.js
import { Router } from "express";
import {
  addToHistory,
  register,
  login,
  getUserHistory
} from "../controller/User.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.route("/add_to_activity").post(addToHistory);
router.route("/get_all_activity").get(getUserHistory);
export default router;
