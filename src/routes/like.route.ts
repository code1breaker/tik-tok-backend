import { Router } from "express";

// controller
import { like } from "../controllers/like.controller.ts";

// validator
import { likeValidator } from "../validators/video.validator.ts";

// middleware
import validate from "../middlewares/validate.middleware.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/:videoId", isAuth, likeValidator, validate, like);

export default router;
