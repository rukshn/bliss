import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  const userId = event.context.userId;
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  await prisma.$disconnect();

  if (!user) {
    return { status: 404, data: { message: "User not found" } };
  }

  const generateGravatar = crypto
    .createHash("sha256")
    .update(user.email)
    .digest("hex");
  const gravatar = `https://www.gravatar.com/avatar/${generateGravatar}`;

  return {
    status: 200,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gravatar: gravatar,
        githubId: user.githubId,
      },
    },
  };
});
