import { param } from "express-validator";

export const likeValidator = [
  param("postId").isMongoId().withMessage("invalid post id"),
];
