import { PrismaClient } from "@prisma/client";

const deletePost = async (id: number, userId: number) => {
  const prisma = new PrismaClient();
  const getPost = await prisma.post.findUnique({
    where: { id },
  });

  if (!getPost) {
    prisma.$disconnect();
    return { status: 404, data: { error: "Post not found" } };
  }
  if (getPost.authorId !== userId) {
    prisma.$disconnect();
    return { status: 403, data: { error: "Unauthorized" } };
  }

  const post = await prisma.post
    .delete({
      where: { id },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  return post;
};

const deletePostHandler = async (event: any) => {
  const body = JSON.parse(event.body);
  const id = body.id;
  const userId = body.userId;
  const post = await deletePost(id, userId);
  return { status: 200, data: post };
};
