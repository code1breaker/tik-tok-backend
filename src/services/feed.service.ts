// models
import Video from "../models/video.model.ts";

// types
import type {
  FeedIf,
  SortTypeIf,
  UserFeedIf,
} from "../types/services/feed.types.ts";

export const feed = async ({ limit, page }: FeedIf) => {
  const skip = (page - 1) * limit;

  const count = await Video.countDocuments();
  const feed = await Video.find()
    .populate("user", "username fullname")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { feed, count };
};

export const userFeed = async ({ userId, sort, limit, page }: UserFeedIf) => {
  const skip = (page - 1) * limit;
  const sortOption: Record<string, any> = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    popular: { "stats.views": -1 },
  };

  const count = await Video.countDocuments({ user: userId });
  const feed = await Video.find({ user: userId })
    .populate("user", "username fullname")
    .sort(sortOption[sort])
    .skip(skip)
    .limit(limit);

  return { feed, count };
};
