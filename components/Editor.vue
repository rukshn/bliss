<script lang="ts" setup>
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Code,
  Quote,
  Heading2,
  Heading3,
  List,
} from "lucide-vue-next";

import { editorStore } from "~/stores/editor";
const store = editorStore();

const editor = useEditor({
  onUpdate() {
    if (editor.value) {
      store.editor = editor?.value.getHTML() ?? "";
    }
  },
  autofocus: true,
  extensions: [
    TiptapStarterKit,
    Placeholder.configure({
      placeholder: "What's on your mind.. start typing",
    }),
  ],
  editorProps: {
    attributes: {
      class: "prose prose-sm focus:outline-none",
    },
  },
});

onMounted(() => {});

onBeforeUnmount(() => {
  if (editor) {
    unref(editor).destroy();
  }
});
</script>

<template>
  <div v-if="editor">
    <div class="flex border rounded-lg mb-2">
      <Button
        variant="ghost"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <Bold />
      </Button>
      <Button
        variant="ghost"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <Italic />
      </Button>
      <Button
        variant="ghost"
        @click="editor.chain().focus().toggleCode().run()"
      >
        <Code />
      </Button>
      <Button
        variant="ghost"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <Quote />
      </Button>
      <Button
        variant="ghost"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <Heading2 />
      </Button>
      <Button
        variant="ghost"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        <Heading3 />
      </Button>

      <Button
        variant="ghost"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <List />
      </Button>
    </div>
    <input
      type="text"
      v-model="store.title"
      class="border-none w-full p-1 focus:outline-none bg-transparent text-lg font-semibold"
    />
    <TiptapEditorContent :editor="editor" />
  </div>
</template>

<style>
.tiptap p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
