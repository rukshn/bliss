import { PrismaClient } from "@prisma/client";

const createProject = async (
  title: string,
  adminId: number,
  description?: string
) => {
  const prisma = new PrismaClient();
  const project = await prisma.project
    .create({
      data: {
        title,
        description: description,
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
  const title = body.title;
  const description = body.description;
  const adminId = event.context.userId;
  const project = await createProject(title, adminId, description);
  return { status: 200, data: project };
});
