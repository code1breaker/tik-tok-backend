import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.ts";
import logger from "../utils/logger.ts";

const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errObj = {
    method: req.method,
    url: req.url,
  };

  if (err instanceof ApiError) {
    const { status, message, error, code, stack } = err;
    logger.error("ApiError:", {
      status,
      message,
      error,
      code,
      stack,
      ...errObj,
    });
    return res.status(status).json({ success: false, message, code, error });
  }

  logger.error("Internal Server error", {
    err,
    ...errObj,
  });

  return res
    .status(500)
    .json({ success: false, message: "Internal Server Error" });
};

export default errorMiddleware;
