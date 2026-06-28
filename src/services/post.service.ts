// models
import ERROR_CODE from "../constants/error-code.ts";
import Post from "../models/post.model.ts";
import User from "../models/user.model.ts";

// types
import type {
  PostIf,
  UpdatePostIf,
  UserPostByIdContextIf,
  UserPostByIdDirectionIf,
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

export const userPost = async ({ username, sort, limit, page }: UserPostIf) => {
  const skip = (page - 1) * limit;
  const sortOption: Record<string, any> = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    popular: { "stats.views": -1 },
  };

  const user = await User.findOne({ username }).select("_id");

  if (!user) {
    throw new NotFound({
      message: "User not found",
      code: ERROR_CODE.USER_NOT_FOUND,
    });
  }

  const userId = user._id;

  const count = await Post.countDocuments({ user: userId });
  const feed = await Post.find({ user: userId })
    .populate("user", "username fullname")
    .sort(sortOption[sort])
    .skip(skip)
    .limit(limit);

  return { feed, count };
};

export const userPostById = async ({
  username,
  postId,
}: UserPostByIdContextIf) => {
  const currentPost = await Post.findById(postId);

  if (!currentPost)
    throw new NotFound({
      message: "Post not found",
      code: ERROR_CODE.POST_NOT_FOUND,
    });

  const targetUser = await User.findOne({ username });
  if (!targetUser)
    throw new NotFound({
      message: "User not found",
      code: ERROR_CODE.USER_NOT_FOUND,
    });

  return { feed: currentPost };
};

export const userPostByIdDirection = async ({
  direction,
  username,
  postId,
  limit,
}: UserPostByIdDirectionIf) => {
  const currentPost = await Post.findById(postId);

  if (!currentPost)
    throw new NotFound({
      message: "Post not found",
      code: ERROR_CODE.POST_NOT_FOUND,
    });

  const targetUser = await User.findOne({ username });
  if (!targetUser)
    throw new NotFound({
      message: "User not found",
      code: ERROR_CODE.USER_NOT_FOUND,
    });

  // Sort from latest to oldest
  const filter: Record<string, any> = {
    user: targetUser?._id,
  };
  const sort: Record<string, any> = {};

  if (direction === "next") {
    filter.createdAt = { $lt: currentPost.createdAt };
    sort.createdAt = -1;
  }

  if (direction === "prev") {
    filter.createdAt = { $gt: currentPost.createdAt };
    sort.createdAt = 1;
  }

  const posts = await Post.find(filter).sort(sort).limit(limit);
  const feed = direction === "prev" ? posts?.reverse() : posts;

  return { feed };
};
