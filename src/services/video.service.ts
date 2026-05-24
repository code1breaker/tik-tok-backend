// models
import ERROR_CODE from "../constants/error-code.ts";
import Video from "../models/video.model.ts";

// types
import type {
  UpdateUploadIf,
  UploadIf,
} from "../types/services/video.types.ts";
import { NotFound } from "../utils/api-error.ts";

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

export const updateUpload = async ({
  videoId,
  filename,
  duration,
  url,
  thumbnail,
  caption,
  hashtags,
  visibility,
  userId,
  status,
}: UpdateUploadIf) => {
  const video = await Video.findByIdAndUpdate(
    videoId,
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

  if (!video)
    throw new NotFound({
      message: "Video not found",
      code: ERROR_CODE.VIDEO_NOT_FOUND,
    });

  return { video };
};
