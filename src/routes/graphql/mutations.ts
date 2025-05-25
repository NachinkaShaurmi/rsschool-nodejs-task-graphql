import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { UserType, CreateUserInput, ChangeUserInput } from './types/user.js';
import { ProfileType, CreateProfileInput, ChangeProfileInput } from './types/profile.js';
import { PostType, CreatePostInput, ChangePostInput } from './types/post.js';
import { GQLContext } from './types/common.js';

export const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: (_, { dto }, ctx: GQLContext) => ctx.prisma.user.create({ data: dto }),
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: (_, { dto }, ctx: GQLContext) => ctx.prisma.profile.create({ data: dto }),
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: (_, { dto }, ctx: GQLContext) => ctx.prisma.post.create({ data: dto }),
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: (_, { id, dto }, ctx: GQLContext) =>
        ctx.prisma.user.update({ where: { id }, data: dto }),
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: (_, { id, dto }, ctx: GQLContext) =>
        ctx.prisma.profile.update({ where: { id }, data: dto }),
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: (_, { id, dto }, ctx: GQLContext) =>
        ctx.prisma.post.update({ where: { id }, data: dto }),
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_, { id }, ctx: GQLContext) =>
        ctx.prisma.user
          .delete({ where: { id } })
          .then(() => true)
          .catch(() => false),
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_, { id }, ctx: GQLContext) =>
        ctx.prisma.post
          .delete({ where: { id } })
          .then(() => true)
          .catch(() => false),
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_, { id }, ctx: GQLContext) =>
        ctx.prisma.profile
          .delete({ where: { id } })
          .then(() => true)
          .catch(() => false),
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { userId, authorId }, ctx: GQLContext) =>
        ctx.prisma.subscribersOnAuthors
          .create({
            data: {
              subscriberId: userId,
              authorId,
            },
          })
          .then(() => true)
          .catch(() => false),
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { userId, authorId }, ctx: GQLContext) =>
        ctx.prisma.subscribersOnAuthors
          .deleteMany({
            where: {
              subscriberId: userId,
              authorId,
            },
          })
          .then(() => true)
          .catch(() => false),
    },
  },
});
