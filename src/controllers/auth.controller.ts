import type { NextFunction, Request, Response } from "express";
import validator from "validator";

// service
import * as AuthService from "../services/auth.service.ts";

// config
import apiResponse from "../utils/api-response.ts";

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

    apiResponse(res, {
      status: 200,
      message: "Please verify your account",
      data,
    });
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
    const { user, accessToken, refreshToken } = await AuthService.verifyEmail({
      token,
    });

    const data = user.toObject();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    apiResponse(res, {
      status: 200,
      message: "Email verified successfully",
      data,
    });
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

    const data = user.toObject();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    apiResponse(res, {
      status: 200,
      message: "Phone verified successfully",
      data,
    });
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
    const { identifier, password } = req.body;
    const email = validator.isEmail(identifier) ? String(identifier) : null;
    const phone = validator.isMobilePhone(identifier) ? +identifier : null;
    const username = !email && !phone && identifier;

    const { user, accessToken, refreshToken } = await AuthService.login({
      email,
      phone,
      username,
      password,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    const { password: pass, ...data } = user?.toObject();

    apiResponse(res, {
      status: 200,
      message: "Login successfully",
      data,
    });
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
    const userId = (req as any).user._id;
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
    const userId = (req as any).user._id;
    await AuthService.getProfile({ userId });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    apiResponse(res, {
      status: 200,
      message: "Logout successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { identifier } = req.body;
    const email = validator.isEmail(identifier) ? String(identifier) : null;
    const phone = validator.isMobilePhone(identifier) ? +identifier : null;

    await AuthService.resendVerification({ email, phone });

    apiResponse(res, {
      status: 200,
      message: `Verification sent on ${identifier}`,
    });
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
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    apiResponse(res, {
      status: 200,
      message: "Token resfreshed successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
