import { PrismaClient } from "@prisma/client";

const createChannel = async (
  title: string,
  projectId: number,
  description?: string
) => {
  const prisma = new PrismaClient();
  const channel = await prisma.channel
    .create({
      data: {
        title,
        description: description,
        project: {
          connect: { id: projectId },
        },
      },
    })
    .catch((e) => {
      return { error: "an unepxected error occured" };
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  return channel;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const title = body.name;
  const description = body.description;
  const projectId = body.project;
  const channel = await createChannel(title, projectId, description);
  return { status: 200, data: channel };
});
