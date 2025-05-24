import { PrismaClient } from '@prisma/client';
import { createLoaders } from '../loaders.js';

export type GQLContext = {
  prisma: PrismaClient;
  loaders: ReturnType<typeof createLoaders>;
};
