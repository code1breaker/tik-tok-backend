import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { BadRequest } from "../utils/api-error.ts";
import ERROR_CODE from "../constants/error-code.ts";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  const errors: Record<string, any>[] = result.array();
  const formatErrors: Record<string, any> = {};

  errors?.forEach((error: any) => {
    if (!formatErrors[error.path]) formatErrors[error.path] = error.msg;
  });

  if (!result.isEmpty())
    throw new BadRequest({
      message: "Validation",
      code: ERROR_CODE.VALIDATION,
      error: formatErrors,
    });

  next();
};

export default validate;
