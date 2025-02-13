<script lang="ts" setup>
const props = defineProps<{
  message: {
    user: {
      name: string;
      avatar: string;
    };
    message: string;
    createdAt: Date;
  };
}>();

const trimMessage = (message: string) => {
  return message.length > 50 ? message.slice(0, 50) + "..." : message;
};
</script>
<template>
  <div class="flex items-center hover:bg-gray-50">
    <Avatar>
      <AvatarImage
        class="h-8 w-8"
        loading="lazy"
        :src="message?.user?.avatar ?? ''"
        :alt="message?.user?.name ?? ''"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <div class="flex-grow">
      <Label>{{ message?.user?.name ?? "" }}</Label>
      <p class="text-sm text-gray-500">{{ trimMessage(message?.message) }}</p>
    </div>
    <div>
      <Label class="text-xs text-gray-500">
        {{ new Date(message?.createdAt).toLocaleDateString() }}
      </Label>
    </div>
  </div>
</template>
