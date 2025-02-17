import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const searchUsers = async (query: string) => {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  await prisma.$disconnect();

  return users;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (query.q) {
    const users = await searchUsers(query.q as string);
    const returnUsers = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: `https://gravatar.com/avatar/${crypto
          .createHash("sha256")
          .update(user.email)
          .digest("hex")}?d=identicon`,
      };
    });
    return { status: 200, data: returnUsers };
  }
});
