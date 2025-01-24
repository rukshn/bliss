export const channelStore = defineStore("channel", {
  state: () => {
    return {
      channel: {} as Channel,
    };
  },
});

interface Channel {
  id: number;
  title: string;
  description: string;
}
