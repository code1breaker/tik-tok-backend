import { body, param } from "express-validator";

export const addCommentValidator = [
  param("postId").isMongoId().withMessage("invalid post id"),
  body("message").trim().notEmpty().withMessage("required"),
  body("parentId").optional().isMongoId().withMessage("invalid id"),
  body("replyParentId").optional().isMongoId().withMessage("invalid id"),
];

export const getCommentValidator = [
  param("postId").isMongoId().withMessage("invalid post id"),
];

export const getRepliesValidator = [
  body("commentId").optional().isMongoId().withMessage("required"),
];
