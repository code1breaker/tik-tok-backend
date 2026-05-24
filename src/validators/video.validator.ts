import { body, param, query } from "express-validator";
import { visibility } from "../types/common/constant.ts";

export const uploadValidator = [
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

export const updateUploadValidator = [
  param("videoId").isMongoId().withMessage("invalid video id"),
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

export const likeValidator = [
  param("videoId").isMongoId().withMessage("invalid video id"),
];

export const addCommentValidator = [
  param("videoId").isMongoId().withMessage("invalid video id"),
  body("message").trim().notEmpty().withMessage("required"),
  body("parentId").optional().isMongoId().withMessage("required"),
];
