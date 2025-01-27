import { defineEventHandler, readBody } from "h3";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const createUser = async (name: string, email: string, password: string) => {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user
      .create({
        data: {
          name: name,
          email: email,
          password: await argon2.hash(password),
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });

    return {
      name: user.name,
      email: user.email,
      id: user.id,
      githubId: user.githubId,
    };
  } catch (error) {
    return { error: "an unexpected error occrued" };
  }
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = await createUser(body.name, body.email, body.password);
  return { data: user };
});
