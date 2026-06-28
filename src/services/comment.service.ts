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
  replyParentId,
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
    replyParentId,
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: { "stats.comments": 1 },
  });

  await Comment.findByIdAndUpdate(parentId, {
    $inc: { replyCount: 1 },
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
    .populate("userId", "username fullname photoUrl")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return { comments };
};

export const getReplies = async ({
  commentId,
  limit,
  page,
}: {
  commentId: string;
  limit: number;
  page: number;
}) => {
  const skip = (page - 1) * limit;
  const comments = await Comment.find({ parentId: commentId })
    .populate("userId", "username fullname photoUrl")
    .limit(limit)
    .skip(skip)
    .lean();

  if (!comments)
    throw new NotFound({
      message: "Comment not found",
      code: ERROR_CODE.COMMENT_NOT_FOUND,
    });

  return { comments };
};
