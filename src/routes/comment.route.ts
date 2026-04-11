import { Router } from "express";

// controller
import { addComment, getComments } from "../controllers/comment.controller.ts";

// validator
import { addCommentValidator } from "../validators/video.validator.ts";

// middleware
import validate from "../middlewares/validate.middleware.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/:videoId", isAuth, addCommentValidator, validate, addComment);
router.get("/:videoId", isAuth, getComments);

export default router;
