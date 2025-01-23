export const feedStore = defineStore("feed", {
  state: () => {
    return {
      feed: [] as Posts[],
    };
  },
});

interface Posts {
  id: number;
  title: string;
  createdAt: Date;
  createdBy: {
    username: string;
    profilePicture: string;
  };
  channel: {
    id: number;
    name: string;
  };
}
