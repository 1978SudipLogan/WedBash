
import type { ErrorRequestHandler } from "express";
import logger from "../config/logger.js";

/**
 * Global Express error handler.
 *
 * All errors forwarded through next(error), including
 * errors from asynchronous Express 5 route handlers,
 * are handled here.
 */
const errorMiddleware: ErrorRequestHandler = (
  error,
  req,
  res,
  _next
) => {
  // Log the error with request context for debugging.
  logger.error(
    {
      err: error,
      method: req.method,
      url: req.originalUrl,
    },
    "Request processing failed"
  );

  // Use an explicit statusCode when supplied by the error.
  const statusCode =
    typeof error.statusCode === "number" &&
    error.statusCode >= 400 &&
    error.statusCode < 600
      ? error.statusCode
      : 500;

  // Never expose internal error details in production.
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
