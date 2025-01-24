import { PrismaClient } from "@prisma/client";

const readPost = async (uuid: string) => {
  const prisma = new PrismaClient();
  const post = await prisma.post
    .findUnique({
      where: { uuid },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  if (!post) {
    return { status: 404, data: { error: "Post not found" } };
  }
  return { status: 200, data: post };
};

export default defineEventHandler(async (event) => {
  const query = getRouterParam(event, "uuid");
  if (!query) {
    return { status: 400, data: { error: "No uuid provided" } };
  } else {
    const post = await readPost(query);
    return post;
  }
});
