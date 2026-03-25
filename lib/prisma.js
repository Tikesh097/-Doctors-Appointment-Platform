import { PrismaClient } from "./generated/prisma2";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis;

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL, // ✅ MUST be inside object
});

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
