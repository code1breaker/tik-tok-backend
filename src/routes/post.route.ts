import { Router } from "express";

// controller
import { createPost, updatePost } from "../controllers/post.controller.ts";
import { addComment, getComments } from "../controllers/comment.controller.ts";
import { like } from "../controllers/like.controller.ts";

// validator
import {
  createPostValidator,
  updatePostValidator,
} from "../validators/post.validator.ts";
import { likeValidator } from "../validators/like.validator.ts";
import { addCommentValidator } from "../validators/comment.validator.ts";

// middleware
import { isAuth } from "../middlewares/auth.middleware.ts";
import validate from "../middlewares/validate.middleware.ts";

const router = Router();

router.post("/", isAuth, createPostValidator, validate, createPost);
router.patch("/:postId", isAuth, updatePostValidator, validate, updatePost);

// comment
router.get("/:postId/comments", isAuth, getComments);
router.post(
  "/:postId/comments",
  isAuth,
  addCommentValidator,
  validate,
  addComment,
);

// like
router.post("/:postId/likes", isAuth, likeValidator, validate, like);

export default router;
