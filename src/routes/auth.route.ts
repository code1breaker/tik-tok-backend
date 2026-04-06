import { Router } from "express";

// controller
import {
  login,
  logout,
  signup,
  verifyEmail,
  verifyPhone,
  getProfile,
  resendVerification,
  refreshToken,
} from "../controllers/auth.controller.ts";

// validator
import {
  loginValidator,
  resendVerificationValidator,
  signupValidator,
} from "../validators/auth.validator.ts";
import { verifyPhoneValidator } from "../validators/auth.validator.ts";

// middleware
import validate from "../middlewares/validate.middleware.ts";
import {
  authLimiter,
  publicLimiter,
} from "../middlewares/rateLimit.middleware.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/signup", authLimiter, signupValidator, validate, signup);
router.post("/login", authLimiter, loginValidator, validate, login);
router.get("/logout", authLimiter, isAuth, logout);
router.get("/verify-email/:token", authLimiter, verifyEmail);
router.post(
  "/verify-phone",
  authLimiter,
  verifyPhoneValidator,
  validate,
  verifyPhone,
);
router.get("/profile", publicLimiter, isAuth, getProfile);
router.get(
  "/resend-verification",
  isAuth,
  resendVerificationValidator,
  resendVerification,
);
router.get("/refresh-token", publicLimiter, refreshToken);

export default router;
