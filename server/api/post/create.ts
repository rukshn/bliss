import { PrismaClient } from "@prisma/client";
import { sendRedirect } from "h3";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = new PrismaClient();

  const user = await prisma.user.findUnique({
    where: {
      id: 1,
    },
  });
  if (user === null) {
    return sendRedirect(event, "/login");
  }
  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      published: true,
      authorId: user.id,
      channelId: body.channelId,
    },
  });

  await prisma.$disconnect();
  return { status: 200, data: post.id };
});
