import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";
import type cors from "@fastify/cors";
import { getWebAppUrl } from "../config/web.js";

type CorsPlugin = typeof cors;

export async function registerHttpSecurity(
  app: FastifyInstance,
  corsPlugin: CorsPlugin
) {
  const allowedOrigins = getAllowedOrigins();

  await app.register(corsPlugin, {
    credentials: false,
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    }
  });

  await app.register(helmet, {
    // Firebase Auth uses Google endpoints that are not covered by Helmet's
    // default policy. Add a tailored CSP after the production domains settle.
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  });

  await app.register(rateLimit, {
    global: true,
    max: positiveIntegerEnv("RATE_LIMIT_MAX", 300),
    timeWindow: "1 minute",
    skipOnError: false
  });
}

function getAllowedOrigins(): Set<string> {
  const configuredOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map(normalizeOrigin);

  return new Set([normalizeOrigin(getWebAppUrl()), ...configuredOrigins]);
}

function normalizeOrigin(value: string): string {
  return new URL(value).origin;
}

function positiveIntegerEnv(name: string, fallback: number): number {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallback;
  }

  const value = Number(rawValue);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return value;
}
