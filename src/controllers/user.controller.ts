import type { NextFunction, Request, Response } from "express";

// service
import * as UserService from "../services/user.service.ts";

// utils
import apiResponse from "../utils/api-response.ts";

export const getProfileByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username = "" } = req.params;

    const user = await UserService.getProfileByUsername({ username });

    await apiResponse(res, {
      status: 200,
      message: "fetch user by id successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
