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
} from "lucide-vue-next";

import { userStore } from "~/stores/user";

const store = userStore();
const channelName = ref("");
const channelDescription = ref("");
const projects: Ref<{ title: string; description: string; id: number }[]> = ref(
  []
);
const newProjectDialog = ref(false);
const newChannelDialog = ref(false);
const activeChannels = ref([]);

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

const selectProject = async (project: {
  title: string;
  description: string;
  id: number;
}) => {
  activeProject.value = project;

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
      activeChannels.value = data.data[0].Channel;
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
  }
});

onMounted(() => {
  const fetchProjects = fetch("/api/project/getUserProjects", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt.value}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      projects.value = data.data[0].Project;
    })
    .catch((error) => console.error("Error:", error));
});
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
              <a
                href="/"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home class="h-4 w-4" />
                Home
              </a>
              <a
                href="/"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Inbox class="h-4 w-4" />
                Inbox</a
              >
              <a
                href="/"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Paperclip class="h-4 w-4" />
                Documents</a
              >
            </nav>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarMenu>
              <Collapsible as-child class="px-5 group/collapsible">
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
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton as-child>
                          <span>Inbox</span>
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
                  <DropdownMenuItem>
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
