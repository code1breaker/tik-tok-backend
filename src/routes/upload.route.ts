import { Router } from "express";

// controller
import { uploadSignature } from "../controllers/upload.controller.ts";

// middleware
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = Router();

router.get("/signature", isAuth, uploadSignature);

export default router;
