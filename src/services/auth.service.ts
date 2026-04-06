import bcrypt from "bcrypt";
import ejs from "ejs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

// model
import Otp from "../models/otp.model.ts";
import User from "../models/user.model.ts";

// service
import { sendEmail } from "./email.service.ts";
import { sendOtp } from "./otp.service.ts";

// utils
import { BadRequest, NotFound } from "../utils/apiError.ts";
import { generateAccessToken, generateRefreshToken } from "../utils/token.ts";

// types
import type { LoginIf, SignupIf } from "../types/services/auth.types.ts";

// config
import { env } from "../config/env.ts";

export const signup = async ({
  firstname,
  lastname,
  email,
  phone,
  username,
  password,
}: SignupIf) => {
  const usernameExist = await User.findOne({ username });
  if (!usernameExist?.isEmailVerified && usernameExist?.isPhoneVerified)
    throw new BadRequest("username already exist");

  const query = {
    ...(email && { email }),
    ...(phone && { phone }),
  };

  const userExist = await User.findOne(query);
  if (userExist?.isEmailVerified || userExist?.isPhoneVerified)
    throw new BadRequest("user already exist");

  if (userExist) {
    await User.deleteOne({ _id: userExist?._id });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    firstname,
    lastname,
    username,
    email,
    phone,
    password: hashPassword,
  });

  if (user.email) sendEmailVerification(user);
  if (user.phone) sendPhoneVerification(user);

  return user;
};

export const sendEmailVerification = async (user: any) => {
  const { _id, email } = user;
  if (!email) return;

  const token = jwt.sign({ _id }, env.VERIFY_EMAIL_SECRET, {
    expiresIn: 1 * 60 * 60 * 1000,
  });
  const verifyLink = `${env.URL}/api/auth/verify-email/${token}`;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, "../../src/views/verify-email.ejs");
  const html = await ejs.renderFile(filePath, { verifyLink });

  await sendEmail({
    email,
    subject: "Verify Email",
    html,
  });
};

export const sendPhoneVerification = async (user: any) => {
  const { phone } = user;

  const otpExist = await Otp.findOne({ phone });
  if (otpExist) return;

  const { otp } = await sendOtp({ phone });
  await Otp.create({
    phone,
    otp,
  });
};

export const verifyEmail = async ({ token }: { token: string | undefined }) => {
  if (!token) throw new BadRequest("token is missing");

  const decodedToken = jwt.verify(token, env.VERIFY_EMAIL_SECRET);
  if (!decodedToken || typeof decodedToken === "string") {
    throw new BadRequest("invalid token");
  }

  const userExist = await User.findById(decodedToken._id);
  if (!userExist) {
    throw new NotFound("user not found");
  }

  const usernameExist = await User.findOne({ username: userExist.username });
  if (usernameExist) throw new BadRequest("username already taken");

  userExist.isEmailVerified = true;
  await userExist.save();

  const accessToken = generateAccessToken(userExist);
  const refreshToken = generateRefreshToken(userExist);

  return { user: userExist, accessToken, refreshToken };
};

export const verifyPhone = async ({
  phone,
  otp,
}: {
  phone: number;
  otp: number;
}) => {
  const userExist = await User.findOne({ phone });
  if (!userExist) {
    throw new NotFound("user not found");
  }

  const otpExist = await Otp.findOne({ phone });
  if (!otpExist) {
    throw new BadRequest("otp does not exist");
  }

  const usernameExist = await User.findOne({ username: userExist.username });
  if (usernameExist) throw new BadRequest("username already exist");

  if (otpExist?.otp !== otp) throw new BadRequest("invalid OTP");

  userExist.isPhoneVerified = true;

  await userExist.save();
  await Otp.findByIdAndDelete(otpExist?._id);

  const accessToken = generateAccessToken(userExist);
  const refreshToken = generateRefreshToken(userExist);

  return { user: userExist, accessToken, refreshToken };
};

export const login = async ({ username, email, phone, password }: LoginIf) => {
  const userExist = await User.findOne({
    $or: [{ username }, { email }, { phone }],
  });
  if (!userExist) throw new BadRequest("invalid credentials");

  const isPasswordMatch = await bcrypt.compare(password, userExist.password);
  if (!isPasswordMatch) throw new BadRequest("invalid credentials");

  if (!userExist.isEmailVerified && !userExist.isPhoneVerified)
    throw new BadRequest("invalid credentials");

  const accessToken = generateAccessToken(userExist);
  const refreshToken = generateRefreshToken(userExist);

  return { user: userExist, accessToken, refreshToken };
};

export const getProfile = async ({ userId }: { userId: string }) => {
  const userExist = await User.findById(userId).select("-password");
  if (!userExist) throw new NotFound("user not found");

  return { user: userExist };
};

export const logout = async ({ userId }: { userId: string }) => {
  const userExist = await User.findById(userId).select("-password");
  if (!userExist) throw new NotFound("user not found");
};

export const resendVerification = async ({
  email,
  phone,
}: {
  email: string | null;
  phone: number | null;
}) => {
  const query = {
    ...(email && { email }),
    ...(phone && { phone }),
  };

  const userExist = await User.findOne(query);
  if (!userExist) throw new NotFound("user not exist");

  if (!userExist.isEmailVerified && !userExist.isPhoneVerified)
    throw new BadRequest("user already verified");

  if (userExist.email) sendEmailVerification(userExist);
  if (userExist.phone) sendPhoneVerification(userExist);

  return { user: userExist };
};

export const refreshToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  if (!refreshToken) throw new BadRequest("refresh token is missing");

  const decodedToken = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
  if (!decodedToken || typeof decodedToken === "string")
    throw new BadRequest("invalid refresh token");

  const userExist = await User.findById(decodedToken._id);
  if (!userExist) throw new NotFound("user not exist");

  const accessToken = generateAccessToken(userExist._id);
  const newRefreshToken = generateRefreshToken(userExist._id);

  return { accessToken, refreshToken: newRefreshToken };
};
