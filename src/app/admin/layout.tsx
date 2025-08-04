
"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Home, Users, ClipboardList, Bell, Settings, Percent, LayoutDashboard, UserCog } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
           <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin" tooltip="Dashboard">
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarGroup>
                <SidebarGroupLabel>Content</SidebarGroupLabel>
                 <SidebarMenuItem>
                  <SidebarMenuButton href="/admin/homepage" tooltip="Homepage">
                    <LayoutDashboard />
                    <span>Homepage</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton href="/admin/notices" tooltip="Notices">
                    <Bell />
                    <span>Notices</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarGroup>
            
             <SidebarSeparator />

             <SidebarGroup>
                <SidebarGroupLabel>Users</SidebarGroupLabel>
                 <SidebarMenuItem>
                  <SidebarMenuButton href="/admin/users" tooltip="Users">
                    <Users />
                    <span>Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton href="/admin/user-profile" tooltip="Profile Settings">
                    <UserCog />
                    <span>Profile Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
                <SidebarGroupLabel>Earnings</SidebarGroupLabel>
                <SidebarMenuItem>
                  <SidebarMenuButton href="/admin/tasks" tooltip="Tasks">
                    <ClipboardList />
                    <span>Tasks</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton href="/admin/referrals" tooltip="Referrals">
                    <Percent />
                    <span>Referrals</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarGroup>

            <SidebarSeparator />

             <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                 <SidebarMenuItem>
                  <SidebarMenuButton href="/admin/settings" tooltip="Settings">
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarGroup>

          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
