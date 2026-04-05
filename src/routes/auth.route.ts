import { Router } from "express";

// controller
import {
  login,
  signup,
  verifyEmail,
  verifyPhone,
} from "../controllers/auth.controller.ts";

// validator
import {
  loginValidator,
  signupValidator,
} from "../validators/auth.validator.ts";
import { verifyPhoneValidator } from "../validators/auth.validator.ts";

// middleware
import validate from "../middlewares/validate.middleware.ts";
import { authLimiter } from "../middlewares/rateLimit.middleware.ts";

const router = Router();

router.post("/signup", authLimiter, signupValidator, validate, signup);
router.post("/login", authLimiter, loginValidator, validate, login);
router.post("/login", authLimiter, validate, signup);
router.get("/verify-email/:token", authLimiter, verifyEmail);
router.post(
  "/verify-phone",
  authLimiter,
  verifyPhoneValidator,
  validate,
  verifyPhone,
);

export default router;
