import { GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType } from './member.js';
import { GQLContext } from './common.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberType },
    memberType: {
      type: MemberType,
      resolve: (profile, _args, context: GQLContext) => {
        return context.prisma.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
      },
    },
  },
});
