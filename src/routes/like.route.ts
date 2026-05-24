import { Router } from "express";

// controller
import { like } from "../controllers/like.controller.ts";

// validator

// middleware
import validate from "../middlewares/validate.middleware.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = Router();

export default router;
