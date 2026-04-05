import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// config
import { env } from "../config/env.ts";

const { combine, timestamp, errors, prettyPrint } = format;

const dailyRotateFile = new DailyRotateFile({
  level: "info",
  filename: "log/%DATE%.log",
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: combine(timestamp(), errors({ stack: true }), prettyPrint()),
});

const console = new transports.Console({
  level: env.LOG_LEVEL || "info",
});

const logger = createLogger({
  level: env.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true }), prettyPrint()),
  transports: [console, dailyRotateFile],
});

if (env.NODE_ENV === "production") {
  logger.remove(console);
}

export default logger;
