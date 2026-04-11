import type { NextFunction, Request, Response } from "express";

import * as CommentService from "../services/comment.service.ts";
import { BadRequest } from "../utils/apiError.ts";

export const comment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { videoId } = req.params;
    const userId = (req as any).userId;

    if (!videoId) throw new BadRequest("video id is missing");

    const { message, parentId } = req.body;

    const { comment } = await CommentService.comment({
      videoId,
      userId,
      message,
      parentId,
    });

    return res.status(200).json({
      success: true,
      message: "comment successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};
