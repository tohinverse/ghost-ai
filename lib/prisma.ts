import { PrismaPg } from "@prisma/adapter-pg"
import { withAccelerate } from "@prisma/extension-accelerate"

import { PrismaClient } from "@/app/generated/prisma/client"

const databaseUrl: string | undefined = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set")
}

/**
 * Prisma Postgres connection strings are served through Accelerate; every other
 * Postgres URL is reached directly through the node-postgres driver adapter.
 */
function createPrismaClient(url: string) {
  if (url.startsWith("prisma+postgres://")) {
    return new PrismaClient({ accelerateUrl: url }).$extends(withAccelerate())
  }

  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) })
}

type PrismaClientInstance = ReturnType<typeof createPrismaClient>

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClientInstance
}

export const prisma: PrismaClientInstance = globalForPrisma.prisma ?? createPrismaClient(databaseUrl)

// Reuse a single client across hot reloads so dev does not exhaust connections.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
