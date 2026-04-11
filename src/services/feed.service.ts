// models
import Video from "../models/video.model.ts";

// types
import type { FeedIf } from "../types/services/feed.types.ts";

export const feed = async ({ limit, page }: FeedIf) => {
  const skip = (page - 1) * limit;

  const count = await Video.countDocuments();
  const feed = await Video.find()
    .populate("user", "username firstname lastname")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { feed, count };
};
