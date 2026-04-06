import type { NextFunction, Request, Response } from "express";
import validator from "validator";

// service
import * as AuthService from "../services/auth.service.ts";

// config
import { env } from "../config/env.ts";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { identifier } = req.body;
    const email = validator.isEmail(identifier) ? String(identifier) : null;
    const phone = validator.isMobilePhone(identifier) ? +identifier : null;

    const user = await AuthService.signup({ ...req.body, email, phone });
    const { password, ...data } = user.toObject();

    return res
      .status(200)
      .json({ success: true, message: "user created successfully", data });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.params;
    const { accessToken, refreshToken } = await AuthService.verifyEmail({
      token,
    });

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
  } catch (error) {
    next(error);
  }
};

export const verifyPhone = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { phone, otp } = req.body;

    const { user, accessToken, refreshToken } = await AuthService.verifyPhone({
      phone,
      otp,
    });

    const { password, ...data } = user.toObject();

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
  } catch (error) {
    next(error);
  }
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

    const { user, accessToken, refreshToken } = await AuthService.login({
      email,
      phone,
      username,
      password,
    });

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

    const { password: pass, ...data } = user?.toObject();

    return res
      .status(200)
      .json({ success: true, message: "Login successfully", data });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).userId;
    const { user } = await AuthService.getProfile({ userId });

    const data = user.toObject();

    return res.status(200).json({ success: true, message: "", data });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).userId;
    await AuthService.getProfile({ userId });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res
      .status(200)
      .json({ success: true, message: "Logout successfully", data: {} });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const { accessToken, refreshToken: newRefreshToken } =
      await AuthService.refreshToken({
        refreshToken,
      });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
