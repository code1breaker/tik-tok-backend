import type { NextFunction, Request, Response } from "express";

import * as FeedService from "../services/feed.service.ts";
import apiResponse from "../utils/api-response.ts";

export const feed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { feed, count } = await FeedService.feed({ limit, page });

    apiResponse(res, {
      status: 200,
      message: "feed fetch successfully",
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
