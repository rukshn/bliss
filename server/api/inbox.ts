import { PrismaClient } from "@prisma/client";
import { generateAvatar } from "~/lib/generateAvatar";
export default defineEventHandler(async (event) => {
  const userId = event.context.userId;
  const prisma = new PrismaClient();

  const messages = await prisma.message
    .findMany({
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
      select: {
        uuid: true,
        title: true,
        content: true,
        created_at: true,
        sender: {
          select: {
            name: true,
            id: true,
            email: true,
          },
        },
        receiver: {
          select: {
            name: true,
            id: true,
            email: true,
          },
        },
      },
    })
    .catch((e) => {
      console.error(e);
      return [];
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  return {
    status: 200,
    data: messages.map((message) => {
      return {
        id: message.uuid,
        subject: message.title,
        message: message.content,
        user: {
          id: message.sender.id,
          name: message.sender.name,
          avatar: generateAvatar(message.sender.email),
        },
        receiver: {
          id: message.receiver.id,
          name: message.receiver.name,
          avatar: generateAvatar(message.receiver.email),
        },
      };
    }),
  };
});
