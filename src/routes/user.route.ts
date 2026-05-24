import { Router } from "express";

// controller
import { getProfileById } from "../controllers/user.controller.ts";

// validator
import { getProfileByIdValidator } from "../validators/user.validator.ts";

// middleware
import { isAuth } from "../middlewares/auth.middleware.ts";
import validate from "../middlewares/validate.middleware.ts";

const router = Router();

router.get(
  "/:userId",
  isAuth,
  getProfileByIdValidator,
  validate,
  getProfileById,
);

export default router;
