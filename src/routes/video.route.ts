import { Router } from "express";

// controller
import { upload } from "../controllers/video.controller.ts";

// validator
import { uploadValidator } from "../validators/video.validator.ts";

// middleware
import { isAuth } from "../middlewares/auth.middleware.ts";
import validate from "../middlewares/validate.middleware.ts";

const router = Router();

router.post("/upload", isAuth, uploadValidator, validate, upload);

export default router;
