import type { NextFunction, Request, Response } from "express";

// service
import * as UserService from "../services/user.service.ts";

// utils
import apiResponse from "../utils/api-response.ts";

export const getProfileById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    const user = await UserService.getProfileById({ userId });

    await apiResponse(res, {
      status: 200,
      message: "fetch user by id successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
