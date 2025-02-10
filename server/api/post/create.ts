import { PrismaClient } from "@prisma/client";
import { sendRedirect } from "h3";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = new PrismaClient();

  const user = await prisma.user.findUnique({
    where: {
      id: event.context.userId,
    },
  });
  if (user === null) {
    return sendRedirect(event, "/login");
  }
  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.post,
      published: true,
      authorId: user.id,
      channelId: body.channelId,
      parentId: body.parentId,
    },
  });

  await prisma.$disconnect();
  return { status: 200, data: post.uuid };
});
