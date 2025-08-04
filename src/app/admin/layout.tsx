
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
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import React from "react"


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const { user, loading } = useAuth()
    const router = useRouter()

    React.useEffect(() => {
        if (!loading && !user) {
        router.push("/login")
        }
    }, [user, loading, router])

    if (loading || !user) {
        return null; // Or a loading spinner
    }

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
