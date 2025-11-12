import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, prettyPrint } = format;

const myFormat = printf(({ level, timestamp, message }) => {
  return `[${timestamp}] [${level}] [${message}]`;
});

const dailyRotateFile = new DailyRotateFile({
  level: "info",
  filename: "log/%DATE%.log",
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: combine(timestamp(), myFormat),
});

const console = new transports.Console({
  level: "info",
  format: combine(timestamp(), prettyPrint()),
});

const logger = createLogger({
  transports: [console, dailyRotateFile],
});

if (process.env.NODE_ENV === "production") {
  logger.remove(console);
}

export default logger;
