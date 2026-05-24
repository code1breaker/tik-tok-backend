import { param } from "express-validator";

export const getProfileByIdValidator = [
  param("userId").notEmpty().withMessage("required").isMongoId(),
];
