// models
import ERROR_CODE from "../constants/error-code.ts";
import Comment from "../models/comment.model.ts";
import Video from "../models/video.model.ts";

// types
import type {
  AddCommentIf,
  GetCommentIf,
} from "../types/services/comment.types.ts";
import { NotFound } from "../utils/api-error.ts";

export const addComment = async ({
  videoId,
  userId,
  message,
  parentId,
}: AddCommentIf) => {
  const video = await Video.findById(videoId);
  if (!video)
    throw new NotFound({
      message: "Video not found",
      code: ERROR_CODE.VIDEO_NOT_FOUND,
    });

  const comment = await Comment.create({
    userId,
    videoId,
    message,
    parentId,
  });

  await Video.findByIdAndUpdate(videoId, {
    $inc: { "stats.comments": 1 },
  });

  return { comment };
};

export const getComments = async ({ videoId, limit, page }: GetCommentIf) => {
  const video = await Video.findById(videoId);
  if (!video)
    throw new NotFound({
      message: "Video not found",
      code: ERROR_CODE.VIDEO_NOT_FOUND,
    });

  const skip = (page - 1) * limit;

  const comments = await Comment.find({
    videoId,
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
