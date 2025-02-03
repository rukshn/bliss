import { defineEventHandler, getQuery, sendRedirect } from "h3";
import { QueryValue } from "ufo";
import { PrismaClient } from "@prisma/client";
import * as jose from "jose";
import crypto from "crypto";

const getGravatar = (email: string) => {
  const hash = crypto.createHash("sha256").update(email).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}`;
};

const generateJWT = async (
  payload: { [key: string]: any },
  expirationTime: string
) => {
  const privateKey = process.env.JWT_KEY;
  const secret = new TextEncoder().encode(privateKey);
  const alg = "HS256";
  const key = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(`${expirationTime}s`)
    .sign(secret);
  return key;
};

const getToken = async (code: QueryValue) => {
  const fetchToken = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code,
      }),
    }
  );

  const response = await fetchToken.json();
  return response;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.code) {
    return { status: 400, data: { error: "No code provided" } };
  } else {
    const token = await getToken(query.code);
    if (token.access_token === undefined) {
      return sendRedirect(event, "/login");
    }
    const user = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    if (user.status !== 200) {
      return sendRedirect(event, "/login");
    }

    const userJson = await user.json();
    const prisma = new PrismaClient();
    let dbUser = await prisma.user
      .findUnique({
        where: { githubId: userJson.id },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });

    if (dbUser === null) {
      const prisma = new PrismaClient();
      dbUser = await prisma.user
        .create({
          data: {
            githubId: userJson.id,
            name: userJson.login,
            email: userJson.email,
          },
        })
        .finally(async () => {
          await prisma.$disconnect();
        });
    }

    const jwt = await generateJWT(
      { githubId: userJson.id, userId: dbUser.id },
      token.expires_in
    );

    setCookie(event, "jwt", jwt, {
      maxAge: token.expires_in,
      path: "/",
    });

    setCookie(event, "token", token.access_token, {
      maxAge: token.expires_in,
      path: "/",
    });

    setCookie(event, "refresh_token", token.refresh_token, {
      maxAge: token.refresh_token_expires_in,
      path: "/",
    });

    setCookie(event, "userId", dbUser.id.toString(), {
      maxAge: token.expires_in,
      path: "/",
    });
  }
  return sendRedirect(event, "/");
});
