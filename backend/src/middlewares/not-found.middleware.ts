
import type { RequestHandler } from "express";

/**
 * Handles unmatched API routes.
 *
 * This middleware must be registered after all valid routes.
 */
const notFoundMiddleware: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export default notFoundMiddleware;
