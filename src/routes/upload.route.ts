import { Router } from "express";

// controller
import {
  uploadSignature,
  deleteMedia,
} from "../controllers/upload.controller.ts";

// middleware
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = Router();

router.get("/signature", isAuth, uploadSignature);
router.delete("/delete", isAuth, deleteMedia);

export default router;
