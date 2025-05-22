import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { MemberType, MemberTypeId } from './types/member.js';
import { GQLContext } from './types/common.js';
import { UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: (_source, _args, context: GQLContext) =>
        context.prisma.memberType.findMany(),
    },

    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
      resolve: (_source, { id }, context: GQLContext) =>
        context.prisma.memberType.findUnique({
          where: { id },
        }),
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (_source, _args, context: GQLContext) => context.prisma.user.findMany(),
    },

    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_source, { id }, context: GQLContext) =>
        context.prisma.user.findUnique({
          where: { id },
        }),
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (_source, _args, context: GQLContext) => context.prisma.post.findMany(),
    },

    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_source, { id }, context: GQLContext) =>
        context.prisma.post.findUnique({
          where: { id },
        }),
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: (_source, _args, context: GQLContext) => context.prisma.profile.findMany(),
    },

    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_source, { id }, context: GQLContext) =>
        context.prisma.profile.findUnique({
          where: { id },
        }),
    },
  },
});
