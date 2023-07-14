import type { Prisma, PrismaClient } from "@prisma/client";

export type PrismaClientType = PrismaClient<
  Prisma.PrismaClientOptions,
  never, | Prisma.RejectPerOperation | undefined
>;