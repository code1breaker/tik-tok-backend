import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV,

  PORT: process.env.PORT || 3001,
  MONGO_URI: process.env.MONGO_URI,

  URL: process.env.URL,
  FRONTEND_URL: process.env.FRONTEND_URL as string,

  VERIFY_EMAIL_SECRET: process.env.VERIFY_EMAIL_SECRET as string,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,

  GOOGLE_APP_EMAIL: process.env.GOOGLE_APP_EMAIL,
  GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD,

  FAST_2_SMS_API_URL: process.env.FAST_2_SMS_API_URL,
  FAST_2_SMS_API_KEY: process.env.FAST_2_SMS_API_KEY,

  LOG_LEVEL: process.env.LOG_LEVEL,
};
