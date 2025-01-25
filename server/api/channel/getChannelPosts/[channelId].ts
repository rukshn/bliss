import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const getChannelPosts = async (channelId: number) => {
  const prisma = new PrismaClient();
  const posts = await prisma.post.findMany({
    where: {
      channelId,
      published: true,
    },
    select: {
      uuid: true,
      title: true,
      created_at: true,
      channel: {
        select: {
          id: true,
          title: true,
        },
      },
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  await prisma.$disconnect();
  const tempPosts = posts.map((post) => {
    return {
      uuid: post.uuid,
      title: post.title,
      createdAt: post.created_at,
      createdBy: {
        username: post.author.name,
        profilePicture: generateGravatar(post.author.email),
      },
      channel: {
        id: post.channel.id,
        name: post.channel.title,
      },
    };
  });
  return tempPosts;
};

const generateGravatar = (email: string) => {
  return `https://www.gravatar.com/avatar/${crypto
    .createHash("sha256")
    .update(email)
    .digest("hex")}`;
};

export default defineEventHandler(async (event) => {
  const params = getRouterParam(event, "channelId");
  if (!params) {
    return { status: 400, data: { error: "No channelId provided" } };
  } else {
    const posts = await getChannelPosts(parseInt(params));
    return { status: 200, data: posts };
  }
});
