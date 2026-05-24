    import { Router } from "express";

    // middleware
    import { isAuth } from "../middlewares/auth.middleware.ts";

    // validator
    import {
    feedValidator,
    userFeedValidator,
    } from "../validators/feed.validator.ts";
    import validate from "../middlewares/validate.middleware.ts";

    // controller
    import { feed, userFeed } from "../controllers/feed.controller.ts";

    const router = Router();

    router.get("/", isAuth, feedValidator, validate, feed);
    router.get("/:userId", isAuth, userFeedValidator, validate, userFeed);

    export default router;
