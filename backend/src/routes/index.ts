import { Router } from "express";

const router = Router();

/**
 * API health-check endpoint.
 *
 * Useful for checking whether the API process is responding.
 */
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "wedbash API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Register feature routes here as your application grows.
// Example:
// router.use("/organizers", organizerRoutes);
// router.use("/weddings", weddingRoutes);
// router.use("/guests", guestRoutes);

export default router;
