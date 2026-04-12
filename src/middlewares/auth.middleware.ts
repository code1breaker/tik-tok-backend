import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// utils
import { BadRequest } from "../utils/apiError.ts";

// config
import { env } from "../config/env.ts";

// model
import User from "../models/user.model.ts";

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) throw new BadRequest("Token is missing");

    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    if (!decodedToken || typeof decodedToken === "string")
      throw new BadRequest("Invalid Token");

    const userExist = await User.findById(decodedToken._id).select("-password");
    if (!userExist) throw new BadRequest("User not exist");

    (req as any).user = userExist;
    next();
  } catch (error) {
    next(error);
  }
};
