export const onlineUserStore = defineStore("onlineUsers", {
  state: () => {
    return {
      users: new Map<number, User>(),
    };
  },
});

interface User {
  id: number;
  name: string;
  lastSeen: Date;
  avatar: string;
  onlineStatus: boolean;
}
