import mongoose from "mongoose";
import { env } from "./env.ts";

export const connectDB = async () => {
  try {
    const uri = env.MONGO_URI || "";
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    throw new Error(`MongoDB Error: ${error}`);
  }
};
