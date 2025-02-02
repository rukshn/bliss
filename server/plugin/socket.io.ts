import type { NitroApp } from "nitropack/types";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const onlineUsers = new Map();

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();

  io.bind(engine);

  io.on("connection", (socket) => {
    socket.on("hello", (data) => {
      socket.broadcast.emit("hello", data);
      if (!data.userId) return;
      const prisma = new PrismaClient();
      const user = prisma.user
        .update({
          where: {
            id: data.userId,
          },
          data: {
            lastSeen: new Date(),
          },
          select: {
            name: true,
            id: true,
            email: true,
          },
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(async () => {
          await prisma.$disconnect();
        });

      onlineUsers.set(socket.id, data.userId);
      socket.emit("online-users", Array.from(onlineUsers));
      socket.broadcast.emit("user-connected", data.userId);
    });

    socket.on("disconnect", (data) => {
      socket.broadcast.emit("user-disconnected", onlineUsers.get(socket.id));
      onlineUsers.delete(socket.id);
    });
  });

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event) {
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      },
      websocket: {
        open(peer) {
          // @ts-expect-error private method and property
          engine.prepare(peer._internal.nodeReq);
          // @ts-expect-error private method and property
          engine.onWebSocket(
            peer._internal.nodeReq,
            peer._internal.nodeReq.socket,
            peer.websocket
          );
        },
      },
    })
  );
});
