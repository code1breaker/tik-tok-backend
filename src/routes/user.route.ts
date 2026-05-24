import { Router } from "express";

// controller
import { getProfileById } from "../controllers/user.controller.ts";
import { userPost } from "../controllers/post.controller.ts";
import {
  followUser,
  getFollower,
  getFollowing,
  incomingFollowRequest,
  outgoingFollowRequest,
  unFollowUser,
} from "../controllers/follow.controller.ts";

// validator
import { getProfileByIdValidator } from "../validators/user.validator.ts";
import { userFeedValidator } from "../validators/feed.validator.ts";
import {
  followUserValidator,
  unFollowUserValidator,
  getFollowerValidator,
  getFollowingValidator,
} from "../validators/follow.validator.ts";

// middleware
import { isAuth } from "../middlewares/auth.middleware.ts";
import validate from "../middlewares/validate.middleware.ts";

const router = Router();

router.get(
  "/:userId",
  isAuth,
  getProfileByIdValidator,
  validate,
  getProfileById,
);

// posts
router.get("/:userId/posts", isAuth, userFeedValidator, validate, userPost);

// follow
router.post(
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
  "/:userId/followers",
  isAuth,
  getFollowerValidator,
  validate,
  getFollower,
);
router.get(
  "/:userId/following",
  isAuth,
  getFollowingValidator,
  validate,
  getFollowing,
);

export default router;
