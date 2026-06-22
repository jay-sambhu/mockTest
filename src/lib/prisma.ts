import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";

const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter, log: ["query"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
