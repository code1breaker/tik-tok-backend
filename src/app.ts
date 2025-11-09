import express from "express";
import authRouter from "./routes/auth.route.ts";

const app = express();
const PORT = process.env.PORT || 3001;

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`server is listening on port: ${PORT}`);
});
