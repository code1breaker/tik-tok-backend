import { body, param } from "express-validator";

export const followUserValidator = [
  param("userId").notEmpty().withMessage("required").isMongoId(),
];

export const unFollowUserValidator = [
  param("userId").notEmpty().withMessage("required").isMongoId(),
];

export const followStatusValidator = [
  param("userId").notEmpty().withMessage("required").isMongoId(),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("required")
    .toLowerCase()
    .isIn(["rejected", "accepted"])
    .withMessage("status must be 'accepted' or 'rejected'"),
];
