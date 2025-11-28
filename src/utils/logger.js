// src/utils/logger.js
import pino from "pino";

// apakah dev mode?
const isDev = process.env.NODE_ENV !== "production";

let logger;

if (isDev) {
  logger = pino({
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard"
      }
    }
  });
} else {
  logger = pino({
    level: "info"
  });
}

export default logger;