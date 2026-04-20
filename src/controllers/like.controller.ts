import type { NextFunction, Request, Response } from "express";

import * as LikeService from "../services/like.service.ts";
import { BadRequest } from "../utils/api-error.ts";
import apiResponse from "../utils/api-response.ts";
import ERROR_CODE from "../constants/error-code.ts";

export const like = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { videoId } = req.params;
    const userId = (req as any).user._id;

    if (!videoId) {
      throw new BadRequest({
        message: "Video id is missing",
        code: ERROR_CODE.VIDEO_ID_MISSING,
      });
    }

    const { video } = await LikeService.like({ videoId, userId });

    apiResponse(res, {
      status: 200,
      message: "Video liked successfully",
      data: video,
    });
  } catch (error) {
    next(error);
  }
};
