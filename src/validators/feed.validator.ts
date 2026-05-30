import { param, query } from "express-validator";

export const feedValidator = [query("limit"), query("page")];

export const userFeedValidator = [
  param("username").notEmpty().withMessage("required"),
  query("sort")
    .optional()
    .isIn(["latest", "popular", "oldest"])
    .withMessage("Sort must be one of 'latest', 'popular', or 'oldest'"),
  query("limit"),
  query("page"),
];
