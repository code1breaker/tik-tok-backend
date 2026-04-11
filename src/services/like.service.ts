// models
import Like from "../models/like.model.ts";
import Video from "../models/video.model.ts";

// types
import type { LikeIf } from "../types/services/like.types.ts";
import { NotFound } from "../utils/apiError.ts";

export const like = async ({ videoId, userId }: LikeIf) => {
  const video = await Video.findById(videoId);
  if (!video) throw new NotFound("video not found");

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
