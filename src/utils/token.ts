import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";

export const generateAccessToken = (user: Record<string, any>) => {
  const accessToken = jwt.sign({ _id: user._id }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  return accessToken;
};

export const generateRefreshToken = (user: Record<string, any>) => {
  const accessToken = jwt.sign({ _id: user._id }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return accessToken;
};
