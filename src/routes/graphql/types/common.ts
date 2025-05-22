import { PrismaClient } from '@prisma/client';

export type GQLContext = {
  prisma: PrismaClient;
};
