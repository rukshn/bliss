import crypto from "crypto";
export const generateAvatar = (email: string) => {
  const hash = crypto.createHash("sha256").update(email).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}`;
};
