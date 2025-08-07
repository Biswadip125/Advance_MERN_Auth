import { Router } from "express";
import {
  checkAuth,
  forgotPassword,
  login,
  logout,
  resetPasword,
  signup,
  verifyEmail,
} from "../controller/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPasword);
export default router;
