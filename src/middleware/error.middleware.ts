import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.ts";

const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    const { status, message } = err;
    return res.status(status).json({ success: false, message });
  }
  return res
    .status(500)
    .json({ success: false, message: "Internal Server Error" });
};

export default errorMiddleware;
