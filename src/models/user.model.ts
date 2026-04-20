import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    photoUrl: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dob: {
      type: Date,
    },
    expireAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: "string" } } },
);

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: { phone: { $type: "number" } },
  },
);

const User = model("User", userSchema);
export default User;
