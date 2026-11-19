
import "dotenv/config";
import { z } from "zod";

/**
 * Define and validate all required environment variables.
 *
 * This prevents the application from starting with
 * missing or incorrectly configured environment variables.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(5000),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  FRONTEND_URL: z
    .string()
    .url()
    .default("http://localhost:3000"),
});

/**
 * Parse environment variables.
 * If validation fails, Zod throws an error and prevents startup.
 */
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment configuration:",
    z.treeifyError(parsedEnv.error)
  );

  process.exit(1);
}

/**
 * Export a centralized, type-safe environment configuration.
 */
export const env = parsedEnv.data;
