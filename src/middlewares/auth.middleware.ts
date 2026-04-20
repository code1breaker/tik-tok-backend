import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// utils
import { BadRequest } from "../utils/api-error.ts";

// config
import { env } from "../config/env.ts";

// model
import User from "../models/user.model.ts";
import ERROR_CODE from "../constants/error-code.ts";

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw new BadRequest({
        message: "Token is missing",
        code: ERROR_CODE.TOKEN_MISSING,
      });
    }

    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    if (!decodedToken || typeof decodedToken === "string") {
      throw new BadRequest({
        message: "Invalid token",
        code: ERROR_CODE.INVALID_TOKEN,
      });
    }

    const userExist = await User.findById(decodedToken._id).select("-password");

    if (!userExist) {
      throw new BadRequest({
        message: "User not exist",
        code: ERROR_CODE.USER_NOT_FOUND,
      });
    }

    (req as any).user = userExist;
    next();
  } catch (error) {
    next(error);
  }
};
