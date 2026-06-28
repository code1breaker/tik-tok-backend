import { model, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    replyParentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    replyCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Comment = model("Comment", commentSchema);
export default Comment;
