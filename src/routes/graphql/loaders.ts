import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

const userSubscribedToLoader = (prisma: PrismaClient) =>
  new DataLoader(async (keys: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        subscribedToUser: {
          some: {
            subscriberId: { in: keys as string[] },
          },
        },
      },
      include: {
        subscribedToUser: true,
      },
    });

    return keys.map((subscriberId) =>
      users.filter((user) =>
        user.subscribedToUser.some((rel) => rel.subscriberId === subscriberId),
      ),
    );
  });

const subscribedToUserLoader = (prisma: PrismaClient) =>
  new DataLoader(async (keys: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        userSubscribedTo: {
          some: {
            authorId: { in: keys as string[] },
          },
        },
      },
      include: {
        userSubscribedTo: true,
      },
    });

    return keys.map((authorId) =>
      users.filter((user) =>
        user.userSubscribedTo.some((rel) => rel.authorId === authorId),
      ),
    );
  });

const membersLoader = (prisma: PrismaClient) =>
  new DataLoader(async (keys) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: keys as string[] } },
    });

    return keys.map((key) => memberTypes.find((type) => type.id === key));
  });

const profileLoader = (prisma: PrismaClient) =>
  new DataLoader(async (keys) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: keys as string[] } },
    });
    return keys.map((key) => profiles.find((profile) => profile.userId === key) || null);
  });

const postLoader = (prisma: PrismaClient) =>
  new DataLoader(async (keys) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: keys as string[] } },
    });

    return keys.map((key) => posts.filter((post) => post.authorId === key));
  });

export const createLoaders = (prisma: PrismaClient) => {
  return {
    membersLoader: membersLoader(prisma),
    profileLoader: profileLoader(prisma),
    postLoader: postLoader(prisma),
    userSubscribedToLoader: userSubscribedToLoader(prisma),
    subscribedToUserLoader: subscribedToUserLoader(prisma),
  };
};
