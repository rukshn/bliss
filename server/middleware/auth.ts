import * as jose from "jose";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const jwtKey = new TextEncoder().encode(process.env.JWT_KEY);
  try {
    if (url.pathname.includes("githubLogin")) return;
    if (url.pathname.includes("signup")) return;
    if (url.pathname.includes("login")) return;
    if (url.pathname.includes("api")) {
      let token = event.headers.get("Authorization");
      if (!token) {
        return { status: 403, data: { error: "Unauthorized" } };
      }
      token = token.split(" ")[1];
      const { payload, protectedHeader } = await jose.jwtVerify(token, jwtKey);
      event.context.userId = payload.userId;
    }
  } catch (e) {
    return { status: 403, data: { error: "Unauthorized" } };
  }
});
