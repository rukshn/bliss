import { PrismaClient } from "@prisma/client";

const getProjectChannels = async (projectId: number) => {
  const prisma = new PrismaClient();
  const channels = await prisma.channel.findMany({
    where: {
      projectId,
      archived: false,
    },
    select: {
      id: true,
      title: true,
      description: true,
      projectId: true,
    },
  });
  return channels;
};

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, "projectId");
  if (!projectId) {
    return { status: 400, data: { error: "No projectId provided" } };
  }
  const channels = await getProjectChannels(parseInt(projectId));
  return { status: 200, data: channels };
});
