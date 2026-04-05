import { rateLimit } from "express-rate-limit";

export const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { message: "Too many request!!!" },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many request!!! Please try again later" },
});
