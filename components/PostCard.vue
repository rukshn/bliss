<script lang="ts" setup>
const props = defineProps<{
  post: {
    uuid: string;
    title: string;
    createdBy: {
      username: string;
      profilePicture: string;
    };
    createdAt: Date;
    channel: {
      name: string;
      id: number;
    };
    comments: number;
  };
}>();
</script>

<template>
  <div class="py-2 my-2 hover:bg-gray-50 rounded-lg px-4">
    <div class="flex items-center">
      <div class="flex items-center gap-4 flex-grow">
        <Avatar>
          <AvatarImage :src="post.createdBy.profilePicture" />
          <AvatarFallback>{{ post.createdBy.username[0] }}</AvatarFallback>
        </Avatar>
        <div class="grid">
          <a
            :href="`/post/${post.uuid}`"
            class="text-gray-800 font-medium"
            variant="link"
            >{{ post.title }}</a
          >
          <div class="flex items-center gap-2" py-1 m-0>
            <Badge variant="secondary">{{ post.comments }}</Badge>
            <p class="leading-3 text-sm">Channel</p>
          </div>
        </div>
        <p class="ml-auto">{{ post.channel.name }}</p>
      </div>
    </div>
  </div>
</template>
