import { Router } from "express";

// controller
import {
  followUser,
  getFollower,
  getFollowing,
  unFollowUser,
} from "../controllers/follow.controller.ts";
import {
  userPost,
  userPostById,
  userPostByIdDirection,
} from "../controllers/post.controller.ts";
import { getProfileByUsername } from "../controllers/user.controller.ts";

// validator
import {
  userFeedByIdDirectionValidator,
  userFeedByIdValidator,
  userFeedValidator,
} from "../validators/feed.validator.ts";
import {
  followUserValidator,
  getFollowerValidator,
  getFollowingValidator,
  unFollowUserValidator,
} from "../validators/follow.validator.ts";
import { getProfileByUsernameValidator } from "../validators/user.validator.ts";

// middleware
import { isAuth } from "../middlewares/auth.middleware.ts";
import validate from "../middlewares/validate.middleware.ts";

const router = Router();

router.get(
  "/:username",
  isAuth,
  getProfileByUsernameValidator,
  validate,
  getProfileByUsername,
);

// posts
router.get("/:username/posts", isAuth, userFeedValidator, validate, userPost);
router.get(
  "/:username/posts/:postId",
  isAuth,
  userFeedByIdValidator,
  validate,
  userPostById,
);
router.get(
  "/:username/posts/:postId/:direction",
  isAuth,
  userFeedByIdDirectionValidator,
  validate,
  userPostByIdDirection,
);

// follow
router.patch(
  "/:userId/follow",
  isAuth,
  followUserValidator,
  validate,
  followUser,
);
router.delete(
  "/:userId/follow",
  isAuth,
  unFollowUserValidator,
  validate,
  unFollowUser,
);
router.get(
  "/:username/followers",
  isAuth,
  getFollowerValidator,
  validate,
  getFollower,
);
router.get(
  "/:username/following",
  isAuth,
  getFollowingValidator,
  validate,
  getFollowing,
);

export default router;
