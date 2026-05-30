import { param } from "express-validator";

export const getProfileByUsernameValidator = [
  param("username").notEmpty().withMessage("required"),
];
