// models
import Video from "../models/video.model.ts";

// types
import type { UploadIf } from "../types/services/video.types.ts";

export const upload = async ({
  filename,
  duration,
  url,
  thumbnail,
  caption,
  hashtags,
  visibility,
  userId,
}: UploadIf) => {
  const video = await Video.create({
    user: userId,
    filename,
    duration,
    caption,
    videoUrl: url,
    thumbnail,
    hashtags,
    visibility,
  });

  return video;
};
