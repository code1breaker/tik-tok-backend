import { model, Schema } from "mongoose";
import { visibility } from "../types/common/constant.ts";

const videoSchema = new Schema(
  {
    caption: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: {
      type: String,
    },
    duration: {
      type: Number,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    hashtags: {
      type: [String],
      default: [],
    },
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      comments: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
    },
    visibility: {
      type: String,
      enum: visibility,
    },
  },
  { timestamps: true },
);

const Video = model("Video", videoSchema);
export default Video;
