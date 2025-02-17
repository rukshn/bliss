import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = new PrismaClient();
  const userId = event.context.userId;
  const message = await prisma.message
    .create({
      data: {
        title: body.subject,
        content: body.content,
        senderId: userId,
        receiverId: body.receiver,
      },
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  return { status: 200, data: message };
});
