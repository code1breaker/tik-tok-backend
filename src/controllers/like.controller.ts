import type { NextFunction, Request, Response } from "express";

import * as LikeService from "../services/like.service.ts";
import { BadRequest } from "../utils/apiError.ts";

export const like = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { videoId } = req.params;
    const userId = (req as any).userId;

    if (!videoId) throw new BadRequest("video id is missing");

    const { video } = await LikeService.like({ videoId, userId });

    return res.status(200).json({
      success: true,
      message: "video liked successfully",
      data: video,
    });
  } catch (error) {
    next(error);
  }
};
