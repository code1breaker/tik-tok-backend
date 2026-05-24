import { body, param } from "express-validator";

export const addCommentValidator = [
  param("postId").isMongoId().withMessage("invalid post id"),
  body("message").trim().notEmpty().withMessage("required"),
  body("parentId").optional().isMongoId().withMessage("required"),
];
