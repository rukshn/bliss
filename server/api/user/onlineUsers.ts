import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  const users = await prisma.user
    .findMany({
      where: {
        lastSeen: {
          gte: new Date(Date.now() - 360000),
        },
      },
      take: 20,
      orderBy: {
        lastSeen: "desc",
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  return {
    status: 200,
    data: {
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        lastSeen: user.lastSeen,
        avatar: `https://gravatar.com/avatar/${crypto
          .createHash("sha256")
          .update(user.email)
          .digest("hex")}?d=identicon`,
      })),
    },
  };
});
