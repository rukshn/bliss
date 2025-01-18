export const userStore = defineStore("user", {
  state: () => {
    return {
      user: {} as User,
    };
  },
});

interface User {
  id: number;
  name: string;
  email: string;
  githubId: string;
  token: string;
  refreshToken: string;
  avatar: string;
}
