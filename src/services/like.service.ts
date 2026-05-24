// models
import ERROR_CODE from "../constants/error-code.ts";
import Like from "../models/like.model.ts";
import Post from "../models/post.model.ts";

// types
import type { LikeIf } from "../types/services/like.types.ts";
import { NotFound } from "../utils/api-error.ts";

export const like = async ({ postId, userId }: LikeIf) => {
  const post = await Post.findById(postId);
  if (!post)
    throw new NotFound({
      message: "Post not found",
      code: ERROR_CODE.POST_NOT_FOUND,
    });

  const existingLike = await Like.findOne({ userId, postId });
  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
    await Post.findByIdAndUpdate(postId, {
      $inc: { "stats.likes": -1 },
    });

    return { post };
  }

  await Like.create({
    userId,
    postId,
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: { "stats.likes": 1 },
  });

  return { post };
};
