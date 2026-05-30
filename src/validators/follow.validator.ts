import { body, param, query } from "express-validator";

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

export const getFollowerValidator = [
  param("username").notEmpty().withMessage("required"),
  query("limit").toInt(),
  query("page").toInt(),
];

export const getFollowingValidator = [
  param("username").notEmpty().withMessage("required"),
  query("limit").toInt(),
  query("page").toInt(),
];
