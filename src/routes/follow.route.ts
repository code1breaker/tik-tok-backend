import { Router } from "express";

// controller
import {
  followUser,
  unFollowUser,
  updateFollowStatus,
  incomingFollowRequest,
  outgoingFollowRequest,
  getFollower,
  getFollowing,
} from "../controllers/follow.controller.ts";

// middleware
import validate from "../middlewares/validate.middleware.ts";
import {
  followStatusValidator,
  followUserValidator,
  unFollowUserValidator,
} from "../validators/follow.validator.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/:userId", isAuth, followUserValidator, validate, followUser);
router.delete(
  "/:userId",
  isAuth,
  unFollowUserValidator,
  validate,
  unFollowUser,
);
router.patch(
  "/status/:userId",
  isAuth,
  followStatusValidator,
  validate,
  updateFollowStatus,
);
router.get("/request/incoming", isAuth, incomingFollowRequest);
router.get("/request/outgoing", isAuth, outgoingFollowRequest);

router.get("/follower", isAuth, getFollower);
router.get("/following", isAuth, getFollowing);

export default router;
