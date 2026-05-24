// models
import ERROR_CODE from "../constants/error-code.ts";
import Comment from "../models/comment.model.ts";
import Post from "../models/post.model.ts";

// types
import type {
  AddCommentIf,
  GetCommentIf,
} from "../types/services/comment.types.ts";
import { NotFound } from "../utils/api-error.ts";

export const addComment = async ({
  postId,
  userId,
  message,
  parentId,
}: AddCommentIf) => {
  const post = await Post.findById(postId);
  if (!post)
    throw new NotFound({
      message: "Post not found",
      code: ERROR_CODE.POST_NOT_FOUND,
    });

  const comment = await Comment.create({
    userId,
    postId,
    message,
    parentId,
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: { "stats.comments": 1 },
  });

  return { comment };
};

export const getComments = async ({ postId, limit, page }: GetCommentIf) => {
  const post = await Post.findById(postId);
  if (!post)
    throw new NotFound({
      message: "Post not found",
      code: ERROR_CODE.POST_NOT_FOUND,
    });

  const skip = (page - 1) * limit;

  const comments = await Comment.find({
    postId,
    parentId: null,
  })
    .populate("user", "username fullname")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const parentIds = comments.map((comment) => comment._id);

  const replies = await Comment.find({
    parentId: { $in: parentIds },
  })
    .populate("user", "username fullname")
    .lean();

  const allComments = comments.map((comment) => {
    const id = comment?._id?.toString();
    const obj: any = {};
    obj[id] = { ...comment, replies: [] };

    replies?.forEach((reply) => {
      const parentId = reply.parentId!.toString();
      if (obj[parentId]) {
        obj[parentId].replies.push(reply);
      }
    });

    const value = obj[id];
    return value;
  });

  return { comments: allComments };
};
