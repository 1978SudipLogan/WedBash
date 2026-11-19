import pino from "pino";
import { env } from "./env.js";

/**
 * Centralized application logger.
 *
 * Development:
 * - Human-readable colored logs.
 *
 * Production:
 * - Structured JSON logs.
 *
 * Sensitive information is redacted to prevent
 * accidental exposure in application logs.
 */
const logger = pino({
  level: env.LOG_LEVEL,

  // Make logs readable during local development.
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,

  // Prevent sensitive information from appearing in logs.
  redact: {
    paths: [
      "password",
      "passwordHash",
      "authorization",
      "req.headers.authorization",
      "req.headers.cookie",
    ],
    censor: "[REDACTED]",
  },
});

export default logger;
