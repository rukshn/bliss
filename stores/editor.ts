export const editorStore = defineStore("editor", {
  state: () => ({
    editor: "",
    title: "",
    open: false,
    message: "",
    hasMessage: false,
  }),
});
