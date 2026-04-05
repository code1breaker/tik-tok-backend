import { body } from "express-validator";
import validator from "validator";

export const signupValidator = [
  body("identifier")
    .trim()
    .notEmpty()
    .withMessage("required")
    .custom((value) => {
      if (validator.isEmail(value)) return true;
      if (validator.isMobilePhone(value)) return true;

      throw new Error("invalid identifier");
    }),
  body("firstname")
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 2, max: 20 })
    .withMessage("firstname must be 2-20 characters"),
  body("lastname")
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 2, max: 20 })
    .withMessage("lastname must be 2-20 characters"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("required")
    .isLength({ min: 3, max: 20 })
    .withMessage("username must be 3-20 characters"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("required")
    .isLength({ min: 5, max: 20 })
    .withMessage("password must be 5-20 characters"),
];

export const verifyPhoneValidator = [
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("required")
    .isMobilePhone("en-IN")
    .withMessage("invalid phone number"),
  body("otp").trim().notEmpty().withMessage("required").toInt(),
];
