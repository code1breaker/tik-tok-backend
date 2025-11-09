import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./config/db.ts";

// routes
import authRouter from "./routes/auth.route.ts";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use("/api/auth", authRouter);

await connectDB();
app.listen(PORT, () => {
  console.log(`server is listening on port: ${PORT}`);
});
