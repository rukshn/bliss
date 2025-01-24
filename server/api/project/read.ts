import { PrismaClient } from "@prisma/client";

const readProject = (id: number) => {
  const prisma = new PrismaClient();
  const project = prisma.project
    .findUnique({
      where: { id },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  return project;
};

export default defineEventHandler(async (event) => {
  const query = getRouterParam(event, "event");
  if (!query) {
    return { status: 400, data: { error: "No id provided" } };
  } else {
    const project = await readProject(parseInt(query));
    return { status: 200, data: project };
  }
});
