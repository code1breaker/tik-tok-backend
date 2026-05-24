import type { NextFunction, Request, Response } from "express";

import * as PostService from "../services/post.service.ts";
import apiResponse from "../utils/api-response.ts";
import type { SortTypeIf } from "../types/services/post.types.ts";
import { BadRequest } from "../utils/api-error.ts";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const userId = (req as any).user._id;
    const post = await PostService.createPost({ ...body, userId });

    apiResponse(res, {
      status: 200,
      message: "post uploaded successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const userId = (req as any).user._id;
    const { postId } = req.params;
    const { post } = await PostService.updatePost({
      ...body,
      userId,
      postId,
    });

    const data = post.toObject();

    apiResponse(res, {
      status: 200,
      message: "post created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const userPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const { userId } = req.params;
    const sort = (req.query.sort as SortTypeIf) || "latest";

    if (!userId) {
      throw new BadRequest({ message: "", code: "" });
    }

    const { feed, count } = await PostService.userPost({
      userId,
      sort,
      limit,
      page,
    });

    apiResponse(res, {
      status: 200,
      message: "user posts fetch successfully",
      data: feed,
      pagination: {
        count,
        limit,
        page,
      },
    });
  } catch (error) {
    next(error);
  }
};
