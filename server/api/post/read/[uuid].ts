import { PrismaClient } from "@prisma/client";
import crpyto from "crypto";

const readPost = async (uuid: string) => {
  const prisma = new PrismaClient();
  const post = await prisma.post
    .findUnique({
      where: { uuid },
      select: {
        id: true,
        title: true,
        uuid: true,
        content: true,
        created_at: true,
        channel: {
          select: {
            title: true,
            id: true,
          },
        },
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  if (!post) {
    return { status: 404, data: { error: "Post not found" } };
  }

  const comments = await prisma.post.findMany({
    where: {
      parentId: post.id,
    },
    select: {
      title: true,
      content: true,
      created_at: true,
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  console.log(comments);
  const commentsWithAvatar = comments.map((comment) => ({
    ...comment,
    avatar: generateGravatar(comment.author.email),
  }));

  return {
    status: 200,
    data: {
      ...post,
      avatar: generateGravatar(post.author.email),
      comments: commentsWithAvatar,
    },
  };
};

const generateGravatar = (email: string) => {
  return `https://www.gravatar.com/avatar/${crpyto
    .createHash("sha256")
    .update(email)
    .digest("hex")}`;
};

export default defineEventHandler(async (event) => {
  const query = getRouterParam(event, "uuid");
  console.log(query);
  if (!query) {
    return { status: 400, data: { error: "No uuid provided" } };
  } else {
    const post = await readPost(query);
    return post;
  }
});
