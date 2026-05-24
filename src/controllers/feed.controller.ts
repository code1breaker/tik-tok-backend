import type { NextFunction, Request, Response } from "express";

import * as FeedService from "../services/feed.service.ts";
import apiResponse from "../utils/api-response.ts";
import { BadRequest } from "../utils/api-error.ts";
import type { SortTypeIf } from "../types/services/feed.types.ts";

export const feed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { feed, count } = await FeedService.feed({ limit, page });

    apiResponse(res, {
      status: 200,
      message: "video fetch successfully",
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

export const userFeed = async (
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

    const { feed, count } = await FeedService.userFeed({
      userId,
      sort,
      limit,
      page,
    });

    apiResponse(res, {
      status: 200,
      message: "user video fetch successfully",
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
