import { PrismaClient } from "@prisma/client";

const deleteProject = (id: number) => {
  const prisma = new PrismaClient();
  const project = prisma.project.update({
    where: { id },
    data: { archived: true },
  });
  return project;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body.id;
  const project = await deleteProject(id);
  return { status: 200, data: project };
});
