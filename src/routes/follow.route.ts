import { Router } from "express";

// controller
import {
  incomingFollowRequest,
  outgoingFollowRequest,
  updateFollowStatus,
} from "../controllers/follow.controller.ts";

// middleware
import { isAuth } from "../middlewares/auth.middleware.ts";

// validator
import validate from "../middlewares/validate.middleware.ts";
import { followStatusValidator } from "../validators/follow.validator.ts";

const router = Router();

router.patch(
  "/status/:userId",
  isAuth,
  followStatusValidator,
  validate,
  updateFollowStatus,
);
router.get("/request/incoming", isAuth, incomingFollowRequest);
router.get("/request/outgoing", isAuth, outgoingFollowRequest);
export default router;
