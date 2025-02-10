<script lang="ts" setup>
definePageMeta({
  layout: "app",
});

import hotkeys from "hotkeys-js";
import { userStore } from "~/stores/user";
import { editorStore } from "~/stores/editor";

const user = userStore().user;
const toggleEditor = ref(false);
const editor = editorStore();

const postId = ref(0);
const postTitle = ref("");
const postContent = ref("");
const authorAvatar = ref("");
const createdBy = ref("");
const createdAt = ref("");
const channelName = ref("");
const channelId = ref(0);
const jwt = useCookie("jwt");
const postLoaded = ref(false);
const comments: Ref<
  {
    author: { name: string; email: string };
    id: number;
    content: string;
    title: string;
    avatar: string;
    created_at: Date;
  }[]
> = ref([]);

onMounted(() => {
  const id = useRoute().params.id;
  const post = fetch(`/api/post/read/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt.value}`,
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      postTitle.value = data.data.title;
      postContent.value = data.data.content;
      authorAvatar.value = data.data.avatar;
      createdBy.value = data.data.author.name;
      createdAt.value = data.data.created_at;
      channelName.value = data.data.channel.title;
      channelId.value = data.data.channel.id;
      postId.value = data.data.id;
      comments.value = data.data.comments;
      postLoaded.value = true;
    });
});

if (document) {
  hotkeys("ctrl+r,command+r,ctrl+b,r,f", function (event, handler) {
    switch (handler.key) {
      case "ctrl+r":
        toggleEditor.value = !toggleEditor.value;
        break;
      case "command+r":
        event.preventDefault();
        toggleEditor.value = !toggleEditor.value;
        break;
      case "ctrl+b":
        console.log("ctrl+b pressed");
        break;
      case "r":
        console.log("r pressed");
        break;
      case "f":
        console.log("f pressed");
        break;
      default:
        break;
    }
  });
}
const submitPost = () => {
  if (editor.title.trim().length === 0) {
    return;
  }
  if (editor.editor.trim().length === 0) {
    return;
  }
  fetch("/api/post/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,
    },
    body: JSON.stringify({
      title: editor.title,
      post: editor.editor,
      channelId: channelId.value,
      parentId: postId.value,
    }),
  }).then((response) => {
    if (response.ok) {
      editor.title = "";
      editor.editor = "";
      toggleEditor.value = false;
    }
  });
};
</script>

<template>
  <ScrollArea class="px-4 sm:px-6 lg:px-8 py-8 border-l h-screen">
    <div class="max-w-3xl mx-10">
      <div v-if="postLoaded === false" class="flex flex-col w-full space-y-3">
        <Skeleton class="h-[125px] rounded-xl" />
        <div class="space-y-2">
          <Skeleton class="h-4 w-[250px]" />
          <Skeleton class="h-4 w-[200px]" />
        </div>
      </div>
      <div v-else class="flex items-center gap-4">
        <Avatar>
          <AvatarImage :src="authorAvatar" />
          <AvatarFallback>{{ createdBy[0] }}</AvatarFallback>
        </Avatar>
        <div class="flex">
          <div class="grid">
            <p class="text-gray-600 test-sm">
              {{ createdBy }}
            </p>
            <p class="text-xs text-gray-500">
              {{
                new Date(createdAt).toLocaleString("en-us", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }) ?? "undefined"
              }}
            </p>
          </div>
        </div>
        <p class="ml-auto">{{ channelName }}</p>
      </div>
      <article class="prose prose-sm mt-4">
        <h1 class="font-medium text-2xl">{{ postTitle }}</h1>
        <div v-html="postContent"></div>
      </article>
      <Separator class="my-4" />
      <div class="mt-4">
        <div class="my-6">
          <div class="bg-gray-100 py-3 rounded-lg px-3">
            <div class="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  class="h-8 w-8"
                  loading="lazy"
                  :src="user?.avatar ?? ''"
                  :alt="user?.name ?? ''"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Label>{{ user.name }}</Label>
              <Button
                variant="ghost"
                @click="toggleEditor = !toggleEditor"
                class="py-4 justify-start h-full flex-grow"
              >
                <Label class="cursor-pointer"
                  >Post your comment to @{{ createdBy }} ↩️</Label
                >
              </Button>
              <div class="ml-auto">
                <Button @click="submitPost">Post</Button>
              </div>
            </div>
            <Editor class="py-3" v-if="toggleEditor"></Editor>
          </div>
        </div>
      </div>
      <div class="mt-4 grid gap-4 mb-52">
        <p class="font-medium text-gray-700">Activity</p>
        <p v-if="comments.length === 0" class="text-muted-foreground">
          There is no activity to show
        </p>
        <CommentCard
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
        ></CommentCard>
      </div>
    </div>
  </ScrollArea>
</template>
