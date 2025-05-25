import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { MemberType, MemberTypeId } from './types/member.js';
import { GQLContext } from './types/common.js';
import { UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

type UserFields = 'profile' | 'posts' | 'userSubscribedTo' | 'subscribedToUser';

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
      resolve: async (_source, _args, context, info) => {
        const parsed = parseResolveInfo(info);
        const fields = Object.keys(
          simplifyParsedResolveInfoFragmentWithType(
            parsed as ResolveTree,
            new GraphQLList(UserType),
          ).fields,
        );

        const include: Partial<Record<UserFields, boolean>> = {};

        if (fields.includes('profile')) include.profile = true;
        if (fields.includes('posts')) include.posts = true;
        if (fields.includes('userSubscribedTo')) include.userSubscribedTo = true;
        if (fields.includes('subscribedToUser')) include.subscribedToUser = true;

        const users = await context.prisma.user.findMany({ include });

        if (fields.includes('userSubscribedTo')) {
          for (const user of users) {
            const related = users.filter(
              (u) =>
                Array.isArray(u.subscribedToUser) &&
                u.subscribedToUser.some((rel) => rel.subscriberId === user.id),
            );
            context.loaders.userSubscribedToLoader.clear(user.id).prime(user.id, related);
          }
        }

        if (fields.includes('subscribedToUser')) {
          for (const user of users) {
            const related = users.filter(
              (u) =>
                Array.isArray(u.userSubscribedTo) &&
                u.userSubscribedTo.some((rel) => rel.authorId === user.id),
            );
            context.loaders.subscribedToUserLoader.clear(user.id).prime(user.id, related);
          }
        }

        return users;
      },
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
