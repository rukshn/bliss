import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const userId = event.context.userId;
  const prisma = new PrismaClient();

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: userId,
        },
        {
          receiverId: userId,
        },
      ],
    },
  });
});
