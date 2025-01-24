import { PrismaClient } from "@prisma/client";

const deleteChannel = async (id: number) => {
  const prisma = new PrismaClient();
  const channel = await prisma.channel
    .update({
      where: { id },
      data: { archived: true },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  return channel;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body.id;
  const channel = await deleteChannel(id);
  return { status: 200, data: channel };
});
