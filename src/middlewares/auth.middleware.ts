import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

// utils
import { UnAuthorized } from "../utils/api-error.ts";

// config
import { env } from "../config/env.ts";

// model
import ERROR_CODE from "../constants/error-code.ts";

interface MyJwtPayload extends JwtPayload {
  _id: string;
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new UnAuthorized({
      message: "Token is missing",
      code: ERROR_CODE.TOKEN_MISSING,
    });
  }

  try {
    const decodedToken = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET,
    ) as MyJwtPayload;

    (req as any).user = decodedToken;
  } catch (error) {
    throw new UnAuthorized({
      message: "Unauthorized",
      code: ERROR_CODE.UNAUTHORIZED,
    });
  }

  next();
};
