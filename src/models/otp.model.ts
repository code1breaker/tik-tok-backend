import { model, Schema } from "mongoose";

const otpSchema = new Schema({
  phone: { type: Number, unique: true, required: true },
  otp: { type: Number, required: true },
});

export default model("Otp", otpSchema);
