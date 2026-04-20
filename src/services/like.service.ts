// models
import ERROR_CODE from "../constants/error-code.ts";
import Like from "../models/like.model.ts";
import Video from "../models/video.model.ts";

// types
import type { LikeIf } from "../types/services/like.types.ts";
import { NotFound } from "../utils/api-error.ts";

export const like = async ({ videoId, userId }: LikeIf) => {
  const video = await Video.findById(videoId);
  if (!video)
    throw new NotFound({
      message: "Video not found",
      code: ERROR_CODE.VIDEO_NOT_FOUND,
    });

  const existingLike = await Like.findOne({ userId, videoId });
  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
    await Video.findByIdAndUpdate(videoId, {
      $inc: { "stats.likes": -1 },
    });

    return { video };
  }

  await Like.create({
    userId,
    videoId,
  });

  await Video.findByIdAndUpdate(videoId, {
    $inc: { "stats.likes": 1 },
  });

  return { video };
};
