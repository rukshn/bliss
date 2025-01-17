<script lang="ts" setup>
import { editorStore } from "~/stores/editor";
const showEditor = ref(false);
const username = ref("");
const profilePic = ref("");

const store = editorStore();
onBeforeMount(() => {
  const token = useCookie("token");
  if (token) {
    fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        username.value = data.login;
        profilePic.value = data.avatar_url;
      })
      .catch((error) => console.error("Error:", error));
  }
});

const submitPost = () => {
  fetch("/api/post/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
</script>
<template>
  <div class="w-7xl px-4 sm:px-6 lg:px-8 py-8 border-l min-h-full">
    <h1 class="font-bold text-3xl">Home</h1>
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
            @click="showEditor = !showEditor"
            class="py-4 justify-start h-full flex-grow"
          >
            <Label class="cursor-pointer">What do you want to share?</Label>
          </Button>
          <div class="ml-auto">
            <Button @click="submitPost">Post</Button>
          </div>
        </div>
        <Editor class="py-3" v-if="showEditor"></Editor>
      </div>
    </div>
  </div>
</template>
