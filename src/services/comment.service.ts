// models
import Comment from "../models/comment.model.ts";
import Video from "../models/video.model.ts";

// types
import type { CommentIf } from "../types/services/comment.types.ts";
import { NotFound } from "../utils/apiError.ts";

export const comment = async ({
  videoId,
  userId,
  message,
  parentId,
}: CommentIf) => {
  const video = await Video.findById(videoId);
  if (!video) throw new NotFound("video not found");

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
