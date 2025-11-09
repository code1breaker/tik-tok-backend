import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "";
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    throw new Error(`MongoDB Error: ${error}`);
  }
};
