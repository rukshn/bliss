import { PrismaClient } from "@prisma/client";

const updatePost = (
  id: number,
  title: string,
  content: string,
  authorId: number
) => {
  const prisma = new PrismaClient();

  const post = prisma.post
    .update({
      where: { id },
      data: {
        title,
        content,
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body.id;
  const title = body.title;
  const content = body.content;
  const authorId = body.authorId;
  const post = await updatePost(id, title, content, authorId);
  return { status: 200, data: post };
});
