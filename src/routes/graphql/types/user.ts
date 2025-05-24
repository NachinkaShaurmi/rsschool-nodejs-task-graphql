import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from 'graphql';
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
        return context.loaders.profileLoader.load(user.id);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (user, _args, context: GQLContext) => {
        return context.loaders.postLoader.load(user.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: (user, _args, context: GQLContext) => {
        return context.loaders.userSubscribedToLoader.load(user.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: (user, _args, context: GQLContext) => {
        return context.loaders.subscribedToUserLoader.load(user.id);
      },
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
