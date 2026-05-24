import type { NextFunction, Request, Response } from "express";

import * as LikeService from "../services/like.service.ts";
import { BadRequest } from "../utils/api-error.ts";
import apiResponse from "../utils/api-response.ts";
import ERROR_CODE from "../constants/error-code.ts";

export const like = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const userId = (req as any).user._id;

    if (!postId) {
      throw new BadRequest({
        message: "Post id is missing",
        code: ERROR_CODE.POST_ID_MISSING,
      });
    }

    const { post } = await LikeService.like({ postId, userId });

    apiResponse(res, {
      status: 200,
      message: "Post liked successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
