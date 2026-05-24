import { Router } from "express";

// middleware
import { isAuth } from "../middlewares/auth.middleware.ts";

// validator
import { feedValidator } from "../validators/feed.validator.ts";
import validate from "../middlewares/validate.middleware.ts";

// controller
import { feed } from "../controllers/feed.controller.ts";

const router = Router();

router.get("/", isAuth, feedValidator, validate, feed);

export default router;
