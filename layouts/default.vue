<script lang="ts" setup>
import { AtSign, Paperclip, ChevronRight, Home, Inbox } from "lucide-vue-next";
</script>
<template>
  <div class="flex h-screen">
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarHeader> </SidebarHeader>
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
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup> </SidebarGroup>
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <slot />
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
