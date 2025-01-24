import { PrismaClient } from "@prisma/client";

const updateProject = (
  id: number,
  title: string,
  description?: string,
  adminId?: number
) => {
  const prisma = new PrismaClient();
  const project = prisma.project
    .update({
      where: { id },
      data: {
        title,
        description,
        admin: {
          connect: { id: adminId },
        },
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  return project;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body.id;
  const title = body.title;
  const description = body.description;
  const adminId = body.adminId;
  const project = await updateProject(id, title, description, adminId);
  return { status: 200, data: project };
});
