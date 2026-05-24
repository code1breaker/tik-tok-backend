import type { NextFunction, Request, Response } from "express";

import * as CommentService from "../services/comment.service.ts";
import { BadRequest } from "../utils/api-error.ts";
import apiResponse from "../utils/api-response.ts";
import ERROR_CODE from "../constants/error-code.ts";

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const userId = (req as any).user._id;
    if (!postId) {
      throw new BadRequest({
        message: "Post id is missing",
        code: ERROR_CODE.POST_ID_MISSING,
      });
    }

    const { message, parentId } = req.body;

    const { comment } = await CommentService.addComment({
      postId,
      userId,
      message,
      parentId,
    });

    apiResponse(res, {
      status: 200,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const limit = Number(req.query.limit ?? 10);
    const page = Number(req.query.page ?? 1);

    if (!postId) {
      throw new BadRequest({
        message: "Post id is missing",
        code: ERROR_CODE.POST_ID_MISSING,
      });
    }

    const { comments } = await CommentService.getComments({
      postId,
      limit,
      page,
    });

    apiResponse(res, {
      status: 200,
      message: "Comment fetched successfully",
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};
