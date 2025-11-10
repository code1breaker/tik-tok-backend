import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 

import { connectDB } from "./config/db.ts";

// routes
import authRouter from "./routes/auth.route.ts";

// middleware
import errorMiddleware from "./middleware/error.middleware.ts";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use(errorMiddleware);

await connectDB();
app.listen(PORT, () => {
  console.log(`server is listening on port: ${PORT}`);
});
