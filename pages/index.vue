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
  console.log(store.open);
};

onBeforeMount(() => {
  const token = useCookie("token");
  const jwt = useCookie("jwt");
  if (token) {
    fetch("/api/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt.value}`,
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        username.value = data.data.user.name;
        profilePic.value = data.data.user.gravatar;
        user.user.email = data.data.user.email;
        user.user.githubId = data.data.user.id;
        user.user.avatar = data.data.user.gravatar;
        user.user.name = data.data.user.name;
      })
      .catch((error) => console.error("Error:", error));
  }
});

const submitPost = () => {
  const jwt = useCookie("jwt");
  if (store.title.trim().length === 0) {
    return;
  }
  if (store.editor.trim().length === 0) {
    return;
  }
  if (chStore.channel.id === 0 || !chStore.channel.id) {
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
  }).then((response) => {
    if (response.ok) {
      store.title = "";
      store.editor = "";
      store.open = false;
    }
  });
};
</script>
<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 border-l min-h-full">
    <div class="max-w-4xl">
      <h1 class="font-bold text-3xl">{{ chStore.channel.title }}</h1>
      <div class="my-6">
        <div class="bg-gray-100 py-3 rounded-lg px-3">
          <div class="flex items-center gap-3">
            <Avatar>
              <AvatarImage :src="profilePic" />
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
      <div class="my-6>">
        <PostCard
          v-for="(post, index) in feed.feed"
          :key="index"
          :post="post"
        />
      </div>
    </div>
  </div>
</template>
