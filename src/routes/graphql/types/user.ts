import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { GQLContext } from './common.js';
import { PostType } from './post.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: (user, _args, context: GQLContext) => {
        return context.prisma.profile.findUnique({
          where: { userId: user.id },
        });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (user, _args, context: GQLContext) => {
        return context.prisma.post.findMany({
          where: { authorId: user.id },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: (user, _args, context: GQLContext) => {
        return context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: { subscriberId: user.id },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: (user, _args, context: GQLContext) => {
        return context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: { authorId: user.id },
            },
          },
        });
      },
    },
  }),
});
