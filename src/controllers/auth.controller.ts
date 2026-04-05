import type { NextFunction, Request, Response } from "express";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// model
import User from "../models/user.model.ts";
import Otp from "../models/otp.model.ts";

// utils
import { BadRequest } from "../utils/apiError.ts";

// service
import AuthService from "../services/auth.service.ts";

// config
import { env } from "../config/env.ts";
import { generateAccessToken, generateRefreshToken } from "../utils/token.ts";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { identifier, username, password } = req.body;
    const email = validator.isEmail(identifier) ? String(identifier) : null;
    const phone = validator.isMobilePhone(identifier) ? +identifier : null;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    let resp;

    const usernameExist = await User.findOne({
      $or: [{ username }],
    });

    if (
      usernameExist &&
      usernameExist.email !== email &&
      usernameExist.phone !== phone
    ) {
      throw new BadRequest("Username already exists!!!");
    }

    if (email) {
      resp = await AuthService.emailSignup({
        ...req.body,
        email,
        hashPassword,
        res,
      });
    }

    if (phone) {
      resp = await AuthService.phoneSignup({
        ...req.body,
        phone,
        hashPassword,
        res,
      });
    }

    return res.status(200).json({ ...resp });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token) throw new BadRequest("Token is missing");

  const decodedToken = jwt.verify(token, env.VERIFY_EMAIL_SECRET);
  if (!decodedToken || typeof decodedToken === "string") {
    throw new BadRequest("Invalid Token");
  }

  const userExist = await User.findById(decodedToken._id);
  if (!userExist) {
    throw new BadRequest("User not exist!!!");
  }

  userExist.isEmailVerified = true;
  await userExist.save();

  const accessToken = generateAccessToken(userExist);
  const refreshToken = generateRefreshToken(userExist);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  return res.redirect(env.FRONTEND_URL);
};

export const verifyPhone = async (req: Request, res: Response) => {
  const { phone, otp } = req.body;

  const userExist = await User.findOne({ phone });
  const otpExist = await Otp.findOne({ phone });

  if (!userExist) {
    throw new BadRequest("User does not exist");
  }

  if (otpExist?.otp !== otp) throw new BadRequest("Invalid OTP");

  userExist.isPhoneVerified = true;

  await userExist.save();
  await Otp.findByIdAndDelete(otpExist?._id);

  const accessToken = generateAccessToken(userExist);
  const refreshToken = generateRefreshToken(userExist);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(201)
    .json({ success: true, message: "User created successfully" });
};
