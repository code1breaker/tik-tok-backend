import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import validator from "validator";

// model
import Otp from "../models/otp.model.ts";
import User from "../models/user.model.ts";

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

    if (usernameExist?.isEmailVerified || usernameExist?.isPhoneVerified) {
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

  const usernameExist = await User.findOne({ username: userExist.username });
  if (usernameExist) throw new BadRequest("Username already taken!!!");

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

  const usernameExist = await User.findOne({ username: userExist.username });
  if (usernameExist) throw new BadRequest("Username already exist!!!");

  if (otpExist?.otp !== otp) throw new BadRequest("Invalid OTP");

  userExist.isPhoneVerified = true;

  await userExist.save();
  await Otp.findByIdAndDelete(otpExist?._id);

  const { password, ...data } = userExist?.toObject();

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
    .json({ success: true, message: "User created successfully", data });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { identifier, username, password } = req.body;
    const email = validator.isEmail(identifier) ? String(identifier) : null;
    const phone = validator.isMobilePhone(identifier) ? +identifier : null;

    const userExist = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });
    if (!userExist) throw new BadRequest("Invalid Credentials");

    const isPasswordMatch = await bcrypt.compare(password, userExist.password);
    if (!isPasswordMatch) throw new BadRequest("Invalid Credentials");

    if (!userExist.isEmailVerified && !userExist.isPhoneVerified)
      throw new BadRequest("Invalid Credentials");

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

    const { password: pass, ...data } = userExist?.toObject();

    return res
      .status(200)
      .json({ success: true, message: "Login successfully", data });
  } catch (error) {
    next(error);
  }
};
