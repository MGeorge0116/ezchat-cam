import { PrismaClient } from "@prisma/client";

// Prevent multiple instances in dev / hot-reload
// eslint-disable-next-line no-var
declare global {
  // eslint-disable-next-line no-var
  var __EZCHAT_PRISMA__: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.__EZCHAT_PRISMA__ ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__EZCHAT_PRISMA__ = prisma;
}

export default prisma;
