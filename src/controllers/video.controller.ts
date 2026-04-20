import type { NextFunction, Request, Response } from "express";

import * as VideoService from "../services/video.service.ts";
import apiResponse from "../utils/api-response.ts";

export const upload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const userId = (req as any).user._id;
    const video = await VideoService.upload({ ...body, userId });

    apiResponse(res, {
      status: 200,
      message: "Video uploaded successfully",
      data: video,
    });
  } catch (error) {
    next(error);
  }
};
