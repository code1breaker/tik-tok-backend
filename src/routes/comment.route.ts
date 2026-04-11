import { Router } from "express";

// controller
import { comment } from "../controllers/comment.controller.ts";

// validator
import { commentValidator } from "../validators/video.validator.ts";

// middleware
import validate from "../middlewares/validate.middleware.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/:videoId", isAuth, commentValidator, validate, comment);

export default router;
