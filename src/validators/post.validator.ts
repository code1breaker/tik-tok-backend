import { body, param } from "express-validator";
import { visibility } from "../types/common/constant.ts";

export const createPostValidator = [
  body("url").trim().notEmpty().withMessage("required"),
  body("filename").trim().optional(),
  body("duration").optional().toFloat(),
  body("thumbnail").trim().optional(),
  body("caption").trim().optional(),
  body("hashtags").optional().isArray(),
  body("visibility")
    .optional()
    .isIn(visibility)
    .withMessage("invalid visibility"),
];

export const updatePostValidator = [
  param("postId").isMongoId().withMessage("invalid post id"),
  body("url").trim().notEmpty().optional(),
  body("filename").trim().optional(),
  body("duration").optional().toFloat(),
  body("thumbnail").trim().optional(),
  body("caption").trim().optional(),
  body("status").trim().optional(),
  body("hashtags").optional().isArray(),
  body("visibility")
    .optional()
    .isIn(visibility)
    .withMessage("invalid visibility"),
];
