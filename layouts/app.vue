<script lang="ts" setup>
import {
  AtSign,
  Paperclip,
  ChevronRight,
  Home,
  Inbox,
  ChevronsUpDown,
  Sparkles,
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Plus,
  UsersRound,
  Hash,
} from "lucide-vue-next";

import { userStore } from "~/stores/user";
import { channelStore } from "~/stores/channel";
import { feedStore } from "~/stores/feed";

const feed = feedStore();
const store = userStore();
const chStore = channelStore();
const channelName = ref("");
const channelCollapseOpen = ref(false);
const channelDescription = ref("");
const projects: Ref<{ title: string; description: string; id: number }[]> = ref(
  []
);
const newProjectDialog = ref(false);
const activeChannel: Ref<{ title: string; description: string; id: number }> =
  ref({
    title: "No channel selected",
    description: "",
    id: 0,
  });

const newChannelDialog = ref(false);

const activeChannels: Ref<
  { title: string; description: string; id: number; projectId: number }[]
> = ref([]);

const newProject = ref({ projectName: "", projectDescription: "" });

const jwt = useCookie("jwt");

const createProject = (e: Event) => {
  e.preventDefault();
  fetch("/api/project/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,
    },
    body: JSON.stringify({
      title: newProject.value.projectName,
      description: newProject.value.projectDescription,
    }),
  }).then((response) => {
    if (response.status === 200) {
      newProject.value.projectName = "";
      newProject.value.projectDescription = "";
    }
  });
};

const activeProject: Ref<{ title: string; description: string; id: number }> =
  ref({
    title: "No project selected",
    description: "",
    id: 0,
  });

const navigateToChannel = (channel: {
  title: string;
  description: string;
  id: number;
  projectId: number;
}) => {
  navigateTo("/");
  getChannelPosts(channel);
};

const getChannelPosts = (channel: {
  id: number;
  title: string;
  description: string;
  projectId: number;
}) => {
  if (activeProject.value.id !== channel.projectId) {
    return;
  }

  activeChannel.value = channel;
  chStore.channel = channel;
  const channelCookie = useCookie("activeChannel", {
    path: "/",
    expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365),
  });
  channelCookie.value = JSON.stringify(channel);

  fetch(`/api/channel/getChannelPosts/${channel.id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt.value}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      feed.feed = data.data;
    });
};

const selectProject = async (project: {
  title: string;
  description: string;
  id: number;
}) => {
  activeProject.value = project;
  const projectCookie = useCookie("activeProject", {
    path: "/",
    expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365),
  });
  projectCookie.value = JSON.stringify(project);

  const activeProjectChannels = await fetch(
    `/api/project/getProjectChannels/${project.id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt.value}`,
      },
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      activeChannels.value = data.data;
    });
};

const createChannel = (e: Event) => {
  e.preventDefault();
  if (activeProject.value.id === 0) {
    return;
  }
  fetch("/api/channel/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,
    },
    body: JSON.stringify({
      name: channelName.value,
      description: channelDescription.value,
      project: activeProject.value.id,
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        channelName.value = "";
        channelDescription.value = "";
      }
    })
    .finally(() => {
      newChannelDialog.value = false;
    });
};

onBeforeMount(() => {
  const token = useCookie("token");
  if (!token.value) {
    navigateTo("/login");
    return;
  }

  const user = fetch("/api/user/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt.value}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      store.user.avatar = data.data.user.gravatar;
      store.user.name = data.data.user.name;
      store.user.email = data.data.user.email;
      store.user.id = data.data.user.id;
    });
});

onMounted(() => {
  const jwt = useCookie("jwt");
  if (!jwt.value) {
    navigateTo("/login");
  }

  const fetchProjects = fetch("/api/project/getUserProjects", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt.value}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      projects.value = data.data[0].Project;
      const lastProject = useCookie("activeProject");
      const lastChannel = useCookie("activeChannel");

      if (lastProject.value) {
        selectProject(lastProject.value as any);
      }

      if (lastChannel.value) {
        getChannelPosts(lastChannel.value as any);
        channelCollapseOpen.value = true;
      }
    })
    .catch((error) => console.error("Error:", error));
});

const logout = () => {
  const jwt = useCookie("jwt");
  jwt.value = "";
  const token = useCookie("token");
  token.value = "";
  navigateTo("/login");
};
</script>
<template>
  <div class="flex h-screen">
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <Dialog v-model:open="newProjectDialog">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <SidebarMenuButton
                      size="lg"
                      class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <div
                        class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                      >
                        <UsersRound class="size-4" />
                      </div>
                      <div class="grid flex-1 text-left text-sm leading-tight">
                        <span class="truncate font-semibold">{{
                          activeProject.title
                        }}</span>
                        <span class="truncate text-xs">{{}}</span>
                      </div>
                      <ChevronsUpDown class="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    align="start"
                    side="bottom"
                    :side-offset="4"
                  >
                    <DropdownMenuLabel class="text-xs text-muted-foreground">
                      Teams
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      v-for="(project, index) in projects"
                      :key="index"
                      class="gap-2 p-2"
                      @click="selectProject(project)"
                    >
                      <div
                        class="flex size-6 items-center justify-center rounded-sm border"
                      >
                        <UsersRound class="size-4" />
                      </div>
                      <div class="font-medium text-muted-foreground">
                        {{ project.title }}
                      </div>
                      <DropdownMenuShortcut
                        >⌘{{ index + 1 }}</DropdownMenuShortcut
                      >
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="gap-2 p-2">
                      <div
                        class="flex size-6 items-center justify-center rounded-md border bg-background"
                      >
                        <Plus class="size-4" />
                      </div>
                      <div class="font-medium text-muted-foreground">
                        <DialogTrigger as-child>
                          <Button variant="ghost"> Add Project </Button>
                        </DialogTrigger>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new project</DialogTitle>
                    <DialogDescription>
                      Create a new project by entering project name and
                      description.
                    </DialogDescription>
                  </DialogHeader>
                  <form class="grid gap-4" @submit="createProject">
                    <div>
                      <Input
                        v-model="newProject.projectName"
                        label="Project Name"
                        placeholder="Enter project name"
                      />
                    </div>
                    <div>
                      <Input
                        v-model="newProject.projectDescription"
                        label="Project Description"
                        placeholder="Enter project description"
                      />
                    </div>
                    <div class="flex justify-end gap-4">
                      <Button>Create</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <nav class="grid items-start px-2 font-medium lg:px-4">
              <Button
                variant="ghost"
                @click="
                  chStore.channel = { title: 'Home', description: '', id: 0 }
                "
                class="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home class="h-4 w-4" />
                Home
              </Button>
              <Button
                variant="ghost"
                @click="
                  chStore.channel = { title: 'Inbox', description: '', id: 0 }
                "
                class="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Inbox class="h-4 w-4" />
                Inbox</Button
              >
              <Button
                variant="ghost"
                class="flex justify-start items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Paperclip class="h-4 w-4" />
                Documents</Button
              >
            </nav>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarMenu>
              <Collapsible
                v-model:open="channelCollapseOpen"
                as-child
                class="px-5 group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger as-child>
                    <SidebarMenuButton>
                      <AtSign></AtSign>
                      Channels
                      <ChevronRight
                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem
                        v-for="(channel, index) in activeChannels"
                        :key="index"
                      >
                        <SidebarMenuSubButton
                          :class="{
                            'bg-muted text-foreground-accent':
                              activeChannel.id === channel.id,
                          }"
                          :is-active="activeChannel.id === channel.id"
                          as-child
                        >
                          <Button
                            variant="ghost"
                            @click="navigateToChannel(channel)"
                          >
                            <span class="flex items-center"
                              ><Hash class="mr-1.5" /> {{ channel.title }}</span
                            >
                          </Button>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      <Dialog v-model:open="newChannelDialog">
                        <SidebarMenuSubItem>
                          <DialogTrigger as-child>
                            <SidebarMenuSubButton as-child>
                              <Button
                                variant="ghost"
                                class="text-muted-foreground"
                              >
                                <Sparkles />
                                Create Channel
                              </Button>
                            </SidebarMenuSubButton>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create new channel</DialogTitle>
                              <DialogDescription>
                                Create a new channel by entering channel name
                                and description.
                              </DialogDescription>
                            </DialogHeader>
                            <form @submit="createChannel" class="grid gap-4">
                              <div>
                                <Input
                                  v-model="channelName"
                                  label="Channel Name"
                                  placeholder="Enter channel name"
                                />
                              </div>
                              <div>
                                <Input
                                  v-model="channelDescription"
                                  label="Channel Description"
                                  placeholder="Enter channel description"
                                />
                              </div>
                              <div class="flex justify-end gap-4">
                                <Button>Create</Button>
                              </div>
                            </form>
                          </DialogContent>
                        </SidebarMenuSubItem>
                      </Dialog>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup> </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <SidebarMenuButton
                    size="lg"
                    class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage
                        :src="store.user?.avatar ?? ''"
                        :alt="store.user?.name ?? ''"
                      />
                      <AvatarFallback class="rounded-lg"> JD </AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{
                        store.user?.name ?? "Annonymous"
                      }}</span>
                      <span class="truncate text-xs">{{
                        store.user?.email ?? ""
                      }}</span>
                    </div>
                    <ChevronsUpDown class="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  :side-offset="4"
                >
                  <DropdownMenuLabel class="p-0 font-normal">
                    <div
                      class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                    >
                      <Avatar class="h-8 w-8 rounded-lg">
                        <AvatarImage
                          :src="store.user?.avatar ?? ''"
                          :alt="store.user?.name ?? ''"
                        />
                        <AvatarFallback class="rounded-lg"> JD </AvatarFallback>
                      </Avatar>
                      <div class="grid flex-1 text-left text-sm leading-tight">
                        <span class="truncate font-semibold">{{
                          store.user?.name ?? "Annonymous"
                        }}</span>
                        <span class="truncate text-xs">{{
                          store.user?.email ?? ""
                        }}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup> </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="logout">
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <slot />
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
