export const feedStore = defineStore("feed", {
  state: () => {
    return {
      feed: [] as Posts[],
    };
  },
});

interface Posts {
  uuid: string;
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
  comments: number;
}
