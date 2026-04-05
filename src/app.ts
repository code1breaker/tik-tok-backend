import cors from "cors";
import express from "express";

import { connectDB } from "./config/db.ts";

// routes
import authRouter from "./routes/auth.route.ts";

// middleware
import errorMiddleware from "./middlewares/error.middleware.ts";
import { publicLimiter } from "./middlewares/rateLimit.middleware.ts";

// config
import { env } from "./config/env.ts";

const app = express();
const PORT = env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api", publicLimiter);

app.use("/api/auth", authRouter);
app.use(errorMiddleware);

await connectDB();
app.listen(PORT, () => {
  console.log(`server is listening on port: ${PORT}`);
});
