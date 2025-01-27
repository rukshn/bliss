import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import * as jose from "jose";

const generateJWT = async (payload: { [key: string]: any }) => {
  const privateKey = process.env.JWT_KEY;
  const secret = new TextEncoder().encode(privateKey);
  const alg = "HS256";
  const key = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
  return key;
};

const userLogin = async (email: string, password: string) => {
  const prisma = new PrismaClient();
  const user = await prisma.user
    .findUnique({
      where: {
        email: email,
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  if (!user) {
    return { status: 404, data: { error: "User not found" } };
  }
  if (!user.password) {
    return { status: 403, data: { error: "Use GitHub login" } };
  }
  const checkPassword = await argon2.verify(user.password, password);
  if (!checkPassword) {
    return { status: 403, data: { error: "Password incorrect" } };
  }

  const jwt = await generateJWT({
    email: user.email,
    userId: user.id,
    githubId: user.githubId,
  });

  return { status: 200, data: { jwt } };
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.email || !body.password) {
    return { status: 400, data: { error: "Email and password required" } };
  }
  const login = await userLogin(body.email, body.password);
  if (login.data.jwt) {
    setCookie(event, "jwt", login.data.jwt, {
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    setCookie(event, "token", login.data.jwt, {
      maxAge: 60 * 60 * 24,
      path: "/",
    });
  }
  return login;
});
