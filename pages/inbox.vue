<script lang="ts" setup>
import { LucidePen, LucideX } from "lucide-vue-next";
import hotkeys from "hotkeys-js";
import { editorStore } from "~/stores/editor";

definePageMeta({
  layout: "app",
});

const editor = editorStore();

const sendMessage = () => {
  const subject = editor.title;
  const content = editor.editor;

  fetch("/api/message/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,
    },
    body: JSON.stringify({
      subject,
      content,
      receiver: sender.value.id,
    }),
  });
};
const selectUser = (user: { name: string; avatar: string; id: number }) => {
  sender.value = user;
  userSearchBox.value = false;
  showUserList.value = false;
  searchQuery.value = "";
};

const userSearchBox = ref(false);

const searchUser = computed(() => {
  if (searchQuery.value.trim().length === 0) return;
  showUserList.value = true;
  fetch(`/api/user/search?q=${searchQuery.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      userList.value = data.data;
    });
});

const userList: Ref<{ name: string; avatar: string; id: number }[]> = ref([]);
const showUserList = ref(false);
const searchQuery = ref("");
const searchUserInput = useTemplateRef("searchUserInput");

const sender = ref({
  name: "",
  id: 0,
  avatar: "",
});

const composer = ref(false);
const initComposeMessage = () => {
  composer.value = !composer.value;
  userSearchBox.value = !userSearchBox.value;
  searchUserInput?.value?.$el.focus();
  console.log(userSearchBox.value);
  if (composer.value) {
    sender.value = { name: "", id: 0, avatar: "" };
  }
};

const jwt = useCookie("jwt");
const message = ref([]);
onMounted(() => {
  if (document) {
    hotkeys("ctrl+n", (event, handler) => {
      event.preventDefault();
      switch (handler.key) {
        case "ctrl+n":
          initComposeMessage();
          console.log("nßß");
          break;
        default:
          break;
      }
    });
  }

  fetch("api/inbox", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      message.value = data.data;
    });
});
</script>
<template>
  <div class="border-l py-8 min-h-screen px-6">
    <div class="flex w-full items-center">
      <div class="flex-grow">
        <h1 class="font-bold text-3xl">Inbox</h1>
        <p class="text-xs text-gray-500">
          Place for your all one on one conversations
        </p>
      </div>
      <Button variant="secondary" @click="initComposeMessage()">
        <LucidePen></LucidePen>
      </Button>
    </div>
    <div v-if="composer" class="mt-3">
      <h2 class="text-gray-600 text-sm">Compose new message to</h2>
      <div v-if="userSearchBox == true" class="relative mt-2">
        <Input
          autofocus="true"
          v-model="searchQuery"
          v-on:update:model-value="{ searchUser }"
          ref="searchUserInput"
        />
        <div class="py-2" v-if="showUserList">
          <a
            variant="ghost"
            v-for="(user, index) in userList"
            :key="index"
            href="#"
            @click="selectUser(user)"
            class="flex items-center px-4 py-3 border-b hover:bg-gray-100 -mx-2"
          >
            <img
              class="h-8 w-8 rounded-full object-cover mx-1"
              :src="user.avatar"
              alt="avatar"
            />
            <p class="text-gray-600 text-sm mx-2">
              <span class="font-bold" href="#">{{ user.name }}</span> replied on
              the
              <span class="font-bold text-blue-500" href="#">Upload Image</span>
              artical . 2m
            </p>
          </a>
        </div>
      </div>
      <div
        v-if="sender.id !== 0"
        class="mt-2 w-full p-2 rounded-lg bg-gray-100"
      >
        <div class="flex w-full items-center gap-2">
          <Avatar class="outline outline-2 outline-blue-500">
            <AvatarImage :src="sender.avatar" />
            <AvatarFallback>{{ sender.name[0] }}</AvatarFallback>
          </Avatar>
          <Label class="flex-grow">{{ sender.name }}</Label>
          <Button variant="ghost" @click="composer = false">
            <LucideX></LucideX>
          </Button>
        </div>
        <div class="mt-4">
          <Editor />
          <div class="mt-2">
            <Button @click="sendMessage">Send</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="grid gap-2">
      <InboxMessage
        v-for="(msg, index) in message"
        :key="index"
        :message="msg"
      />
    </div>
  </div>
</template>
