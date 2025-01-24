import { PrismaClient } from "@prisma/client";

const getAllPosts = async (channelId: number) => {
  const prisma = new PrismaClient();
  const posts = await prisma.post.findMany({
    where: {
      channelId,
    },
  });
  await prisma.$disconnect();
  return posts;
};

export default defineEventHandler(async (event) => {
  const params = getRouterParam(event, "channelId");
  if (!params) {
    return { status: 400, data: { error: "No channelId provided" } };
  } else {
    const posts = await getAllPosts(parseInt(params));
    return { status: 200, data: posts };
  }
});
