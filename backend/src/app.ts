import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";

import { env } from "./config/env.js";
import logger from "./config/logger.js";

import apiRoutes from "./routes/index.js";
import notFoundMiddleware from "./middlewares/not-found.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

/**
 * Initialize the Express application.
 *
 * This file configures the application but does not
 * start the HTTP server.
 */
const app = express();

/**
 * Disable Express technology disclosure header.
 */
app.disable("x-powered-by");

/**
 * Security middleware.
 *
 * Helmet sets HTTP security headers to protect the API
 * against several common web vulnerabilities.
 */
app.use(helmet());

/**
 * CORS configuration.
 *
 * Allows the Next.js frontend to communicate with
 * the Express backend while supporting credentials.
 */
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

/**
 * HTTP request logging.
 *
 * Pino HTTP automatically logs incoming requests,
 * response status codes and request duration.
 */
app.use(
  pinoHttp({
    logger,
    autoLogging: true,
  }),
);

/**
 * Parse incoming JSON request bodies.
 *
 * The limit prevents excessively large JSON payloads.
 */
app.use(
  express.json({
    limit: "10kb",
  }),
);

/**
 * Parse URL-encoded form submissions.
 */
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);

/**
 * Parse cookies from incoming HTTP requests.
 *
 * Required when using cookie-based authentication.
 */
app.use(cookieParser());

/**
 * Register application API routes.
 *
 * All API endpoints will start with /api/v1.
 */
app.use("/api/v1", apiRoutes);

/**
 * Handle requests that do not match any registered route.
 *
 * Must be placed after all application routes.
 */
app.use(notFoundMiddleware);

/**
 * Centralized error handling.
 *
 * Must be the last middleware in the Express pipeline.
 */
app.use(errorMiddleware);

export default app;
