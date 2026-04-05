import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { BadRequest } from "../utils/apiError.ts";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  const errors: Record<string, any>[] = result.array();
  const formatErrors: Record<string, any> = {};

  errors?.forEach((error: any) => {
    if (!formatErrors[error.path]) formatErrors[error.path] = error.msg;
  });

  if (!result.isEmpty()) throw new BadRequest("Validation", formatErrors);

  next();
};

export default validate;
