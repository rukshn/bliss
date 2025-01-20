import { PrismaClient } from "@prisma/client";

const getUserProjects = async (userId: number) => {
  const prisma = new PrismaClient();
  const projects = await prisma.user
    .findMany({
      where: { id: userId },
      select: {
        Project: {
          where: { archived: false },
          select: {
            title: true,
            id: true,
            description: true,
          },
        },
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  return projects;
};

export default defineEventHandler(async (event) => {
  const userId = await event.context.userId;
  const projects = await getUserProjects(userId);
  return { status: 200, data: projects };
});
