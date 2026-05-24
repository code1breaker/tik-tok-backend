import { Router } from "express";

// controller

// validator

// middleware
import { isAuth } from "../middlewares/auth.middleware.ts";
import validate from "../middlewares/validate.middleware.ts";

const router = Router();

export default router;
