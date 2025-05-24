import DataLoader from 'dataloader';
import { User } from '@prisma/client';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import { RootQueryType } from './queries.js';
import { Mutations } from './mutations.js';
import depthLimit from 'graphql-depth-limit';
import { createLoaders } from './loaders.js';

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const document = parse(req.body.query);
      const errors = validate(schema, document, [depthLimit(5)]);

      if (errors.length) return { errors };

      const loaders = createLoaders(prisma);

      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prisma, loaders },
      });
    },
  });
};

export default plugin;
