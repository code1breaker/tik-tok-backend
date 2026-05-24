// models
import Post from "../models/post.model.ts";

// types
import type { FeedIf } from "../types/services/feed.types.ts";

export const feed = async ({ limit, page }: FeedIf) => {
  const skip = (page - 1) * limit;

  const count = await Post.countDocuments();
  const feed = await Post.find()
    .populate("user", "username fullname")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { feed, count };
};
