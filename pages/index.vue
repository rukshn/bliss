<script lang="ts" setup>
definePageMeta({
  layout: "app",
});
import { editorStore } from "~/stores/editor";
import { userStore } from "~/stores/user";
import { channelStore } from "~/stores/channel";
import { feedStore } from "~/stores/feed";

const store = editorStore();
const username = ref("");
const profilePic = ref("");
const feed = feedStore();

const chStore = channelStore();
const user = userStore();

const toggleEditor = () => {
  store.open = !store.open;
};

const submitPost = () => {
  if (!store.open) {
    store.open = true;
    return;
  }
  const jwt = useCookie("jwt");
  if (store.title.trim().length === 0) {
    store.message = "Title is required";
    store.hasMessage = true;
    return;
  }
  if (store.editor.trim().length === 0) {
    store.message = "Post is required";
    store.hasMessage = true;
    return;
  }
  if (chStore.channel.id === 0 || !chStore.channel.id) {
    store.message = "Please select a channel";
    store.hasMessage = true;
    return;
  }
  fetch("/api/post/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,
    },
    body: JSON.stringify({
      title: store.title,
      post: store.editor,
      channelId: chStore.channel.id,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      feed.feed.unshift({
        title: store.title,
        uuid: data.data,
        createdBy: {
          username: user.user.name,
          profilePicture: user.user.avatar,
        },
        createdAt: new Date(),
        channel: {
          id: chStore.channel.id,
          name: chStore.channel.title,
        },
        comments: 0,
      });
      store.title = "";
      store.editor = "";
      store.open = false;
      store.message = "";
      store.hasMessage = false;
    });
};
</script>
<template>
  <div class="border-l py-8">
    <h1 class="font-bold text-3xl px-6">{{ chStore.channel.title }}</h1>
    <p class="text-xs text-gray-500 px-6">{{ chStore.channel.description }}</p>
    <div class="p-6">
      <div class="bg-gray-100 py-3 rounded-lg px-3">
        <div class="flex items-center gap-3">
          <Avatar>
            <AvatarImage :src="user.user.avatar ?? ''" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Label>{{ username }}</Label>
          <Button
            variant="ghost"
            @click="toggleEditor"
            class="py-4 justify-start h-full flex-grow"
          >
            <Label class="cursor-pointer">What do you want to share?</Label>
          </Button>
          <div class="ml-auto">
            <Button @click="submitPost">Post</Button>
          </div>
        </div>
        <Editor class="py-3" v-if="store.open"></Editor>
      </div>
    </div>
    <ScrollArea class="px-6 grid h-[calc(100vh-190px)]">
      <PostCard v-for="(post, index) in feed.feed" :key="index" :post="post" />
    </ScrollArea>
  </div>
</template>
