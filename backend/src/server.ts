import { createServer, type Server } from "node:http";

import app from "./app.js";
import { env } from "./config/env.js";
import logger from "./config/logger.js";

/**
 * Create the HTTP server using the configured Express app.
 *
 * Separating createServer from app configuration gives
 * us direct control over the server lifecycle.
 */
const server: Server = createServer(app);

/**
 * Track the server lifecycle.
 *
 * Prevents multiple shutdown attempts when multiple
 * termination signals are received.
 */
let isShuttingDown = false;

/**
 * Start the HTTP server.
 *
 * The server begins accepting incoming requests only
 * after the listen operation succeeds.
 */
const startServer = (): void => {
  server.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV,
      },
      "wedbash API server started successfully",
    );
  });
};

/**
 * Handle server-level errors.
 *
 * Example: EADDRINUSE when the configured port
 * is already being used by another process.
 */
server.on("error", (error: NodeJS.ErrnoException) => {
  logger.fatal(
    {
      err: error,
      code: error.code,
    },
    "Failed to start HTTP server",
  );

  process.exit(1);
});

/**
 * Gracefully shut down the HTTP server.
 *
 * This stops accepting new connections and allows
 * existing requests to finish before the process exits.
 */
const shutdownServer = (signal: string): void => {
  // Ignore repeated shutdown requests.
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info(
    { signal },
    "Shutdown signal received. Starting graceful shutdown",
  );

  /**
   * Safety timeout.
   *
   * Prevent the process from hanging indefinitely
   * if active connections do not close.
   */
  const forceShutdownTimer = setTimeout(() => {
    logger.error("Graceful shutdown timed out. Forcing exit");

    // Forcefully close remaining HTTP connections.
    server.closeAllConnections();

    process.exit(1);
  }, 10000);

  // Do not keep the Node.js process alive just for this timer.
  forceShutdownTimer.unref();

  /**
   * Stop accepting new requests and wait for active
   * connections to finish.
   */
  server.close((error) => {
    clearTimeout(forceShutdownTimer);

    if (error) {
      logger.error({ err: error }, "Error while closing HTTP server");

      process.exit(1);
    }

    logger.info("HTTP server closed successfully");

    /**
     * Later, disconnect Prisma and close other resources
     * here before exiting the process.
     */
    logger.info("Application shutdown completed");

    process.exit(0);
  });
};

/**
 * Listen for operating system termination signals.
 *
 * SIGINT: Usually triggered by Ctrl + C.
 * SIGTERM: Commonly sent by hosting platforms and process managers.
 */
process.on("SIGINT", () => shutdownServer("SIGINT"));
process.on("SIGTERM", () => shutdownServer("SIGTERM"));

/**
 * Start the application.
 */
startServer();
