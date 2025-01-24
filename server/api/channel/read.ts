import { PrismaClient } from "@prisma/client";

const readChannel = async (id: number) => {
  const prisma = new PrismaClient();
  const channel = await prisma.channel
    .findUnique({
      where: { id },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  return channel;
};

export default defineEventHandler(async (event) => {
  const query = getRouterParam(event, "event");
  if (!query) {
    return { status: 400, data: { error: "No id provided" } };
  } else {
    const channel = await readChannel(parseInt(query));
    return { status: 200, data: channel };
  }
});
