import { body, param, query } from "express-validator";
import { visibility } from "../types/common/constant.ts";

export const uploadValidator = [
  body("url").trim().notEmpty().withMessage("required"),
  body("thumbnail").trim(),
  body("caption").trim(),
  body("hashtags").isArray(),
  body("visibility").isIn(visibility).withMessage("invalid visibility"),
];

export const feedValidator = [query("limit"), query("page")];

export const likeValidator = [
  param("videoId").isMongoId().withMessage("invalid video id"),
];

export const addCommentValidator = [
  param("videoId").isMongoId().withMessage("invalid video id"),
  body("message").trim().notEmpty().withMessage("required"),
  body("parentId").optional().isMongoId().withMessage("required"),
];
