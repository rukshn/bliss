<script lang="ts" setup>
import { LucidePen } from "lucide-vue-next";

const composer = ref(false);
definePageMeta({
  layout: "app",
});
const jwt = useCookie("jwt");
const message = ref([]);
onMounted(() => {
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
      <Button variant="secondary" @click="console.log('New Message')">
        <LucidePen></LucidePen>
      </Button>
    </div>
    <div v-if="composer"></div>
    <div class="grid gap-2">
      <InboxMessage
        v-for="(msg, index) in message"
        :key="index"
        :message="msg"
      />
    </div>
  </div>
</template>
