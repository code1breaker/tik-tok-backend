import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.ts";

// routes
import authRouter from "./routes/auth.route.ts";
import userRouter from "./routes/user.route.ts";
import followRouter from "./routes/follow.route.ts";
import postRouter from "./routes/post.route.ts";
import uploadRouter from "./routes/upload.route.ts";
import feedRouter from "./routes/feed.route.ts";
import likeRouter from "./routes/like.route.ts";
import commentRouter from "./routes/comment.route.ts";

// middleware
import errorMiddleware from "./middlewares/error.middleware.ts";
import { publicLimiter } from "./middlewares/rateLimit.middleware.ts";

// config
import { env } from "./config/env.ts";

const app = express();
const PORT = env.PORT;

app.use(
  cors({
    origin: [env.FRONTEND_URL],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", publicLimiter);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/follows", followRouter);
app.use("/api/posts", postRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/feeds", feedRouter);
app.use("/api/likes", likeRouter);
app.use("/api/comments", commentRouter);
app.use(errorMiddleware);

await connectDB();
app.listen(PORT, () => {
  console.log(`server is listening on port: ${PORT}`);
});
