// models
import ERROR_CODE from "../constants/error-code.ts";
import Post from "../models/post.model.ts";

// types
import type {
  UpdatePostIf,
  PostIf,
  UserPostIf,
} from "../types/services/post.types.ts";
import { NotFound } from "../utils/api-error.ts";

export const createPost = async ({
  filename,
  duration,
  url,
  thumbnail,
  caption,
  hashtags,
  visibility,
  userId,
}: PostIf) => {
  const post = await Post.create({
    user: userId,
    filename,
    duration,
    caption,
    videoUrl: url,
    thumbnail,
    hashtags,
    visibility,
  });

  return post;
};

export const updatePost = async ({
  postId,
  filename,
  duration,
  url,
  thumbnail,
  caption,
  hashtags,
  visibility,
  userId,
  status,
}: UpdatePostIf) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      user: userId,
      filename,
      duration,
      caption,
      videoUrl: url,
      thumbnail,
      hashtags,
      visibility,
      status,
    },
    { new: true },
  );

  if (!post)
    throw new NotFound({
      message: "Post not found",
      code: ERROR_CODE.POST_NOT_FOUND,
    });

  return { post };
};

export const userPost = async ({ userId, sort, limit, page }: UserPostIf) => {
  const skip = (page - 1) * limit;
  const sortOption: Record<string, any> = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    popular: { "stats.views": -1 },
  };

  const count = await Post.countDocuments({ user: userId });
  const feed = await Post.find({ user: userId })
    .populate("user", "username fullname")
    .sort(sortOption[sort])
    .skip(skip)
    .limit(limit);

  return { feed, count };
};
