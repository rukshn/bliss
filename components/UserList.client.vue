<script lang="ts" setup>
import { socket } from "./socket";
import { onlineUserStore } from "~/stores/onlineUsers";

const isConnected = ref(false);
const transport = ref("N/A");
const user_token = useCookie("userId");
const users = onlineUserStore();

if (socket.connected) {
  onConnect();
}

function onConnect() {
  isConnected.value = true;
  socket.emit("hello", { userId: user_token.value });
  transport.value = socket.io.engine.transport.name;

  socket.io.engine.on("upgrade", (rawTransport) => {
    transport.value = rawTransport.name;
  });
}
function onDisconnect() {
  socket.emit("dissconnect", "something");
  isConnected.value = false;
  transport.value = "N/A";
}

const updateUsers = (data: {
  id: number;
  name: string;
  avatar: string;
  onlineStatus: boolean;
  lastSeen: Date;
}) => {};

socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);

socket.on("user-disconnected", (data) => {
  let tempUser = users.users.get(data);
  if (tempUser) {
    tempUser.onlineStatus = false;
    users.users.set(data, tempUser);
  }

  const userArray = Array.from(users.users);
  userArray.sort((a, b) => {
    if (a[1].onlineStatus && !b[1].onlineStatus) {
      return -1;
    }
    if (!a[1].onlineStatus && b[1].onlineStatus) {
      return 1;
    }
    return 0;
  });

  users.users = new Map(userArray);
});

socket.on("online-users", (data: [string, number][]) => {
  console.log("online-users", data);
  data.forEach((user) => {
    let tempUser = users.users.get(user[1]);
    if (tempUser) {
      tempUser.onlineStatus = true;
      users.users.set(user[1], tempUser);
    }
  });
});

socket.on("user-connected", (data) => {
  console.log("user-online", data);
  let tempUser = users.users.get(data);
  if (tempUser) {
    tempUser.onlineStatus = true;
    users.users.set(data, tempUser);
  }
});

const setOnlineStatus = (userStatus: boolean) => {
  return userStatus ? "bg-green-500" : "bg-red-500";
};

onBeforeUnmount(() => {
  socket.off("connect", onConnect);
  socket.off("disconnect", onDisconnect);
});
</script>

<template>
  <div class="grid gap-2 px-6">
    <div
      class="flex items-center space-x-2"
      v-for="(user, index) in Array.from(users.users)"
      :key="index"
    >
      <div class="relative">
        <Avatar>
          <AvatarImage :src="user[1].avatar" />
          <AvatarFallback>{{ user[1].name[0] }} </AvatarFallback>
        </Avatar>
        <span
          :class="setOnlineStatus(user[1].onlineStatus)"
          class="absolute top-3/4 left-6 transform -translate-y-1/2 w-3.5 h-3.5 border-2 border-white dark:border-gray-800 rounded-full"
        ></span>
      </div>
      <p class="font-medium text-gray-600">{{ user[1].name }}</p>
    </div>
  </div>
</template>
