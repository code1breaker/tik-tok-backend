import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.ts";
import logger from "../utils/logger.ts";

const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);
  if (err instanceof ApiError) {
    const { status, message, error } = err;
    return res.status(status).json({ success: false, message, error });
  }

  return res
    .status(500)
    .json({ success: false, message: "Internal Server Error", error: {} });
};

export default errorMiddleware;
