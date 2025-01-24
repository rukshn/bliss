import { PrismaClient } from "@prisma/client";

const editChannel = (id: number, title: string, description?: string) => {
  const prisma = new PrismaClient();
  const channel = prisma.channel
    .update({
      where: { id },
      data: {
        title,
        description,
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
  const description = body.description;
  const channel = await editChannel(id, title, description);
  return { status: 200, data: channel };
});
