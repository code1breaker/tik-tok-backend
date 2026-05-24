import { Router } from "express";

// controller
import { upload, updateUpload } from "../controllers/video.controller.ts";

// validator
import {
  updateUploadValidator,
  uploadValidator,
} from "../validators/video.validator.ts";

// middleware
import { isAuth } from "../middlewares/auth.middleware.ts";
import validate from "../middlewares/validate.middleware.ts";

const router = Router();

router.post("/upload", isAuth, uploadValidator, validate, upload);
router.patch(
  "/upload/:videoId",
  isAuth,
  updateUploadValidator,
  validate,
  updateUpload,
);

export default router;
