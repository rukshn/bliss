<script lang="ts" setup>
const props = defineProps<{
  comment: {
    title: string;
    content: string;
    created_at: Date;
    author: {
      name: string;
    };
    avatar: string;
  };
}>();
</script>
<template>
  <div class="py-2">
    <div class="flex items-centeer gap-4">
      <Avatar class="h-8 w-8">
        <AvatarImage :src="comment.avatar" />
        <AvatarFallback>{{ comment.author.name[0] }} </AvatarFallback>
      </Avatar>
      <p class="font-semibold text-gray-700 text-sm">
        {{ comment.author.name }}
        <span class="text-gray-500 ml-2 text-xs">{{
          new Date(comment.created_at).toLocaleString("en-us", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        }}</span>
      </p>
    </div>
    <div class="mt-2">
      <div class="pl-12 prose prose-sm" v-html="comment.content"></div>
    </div>
  </div>
</template>
