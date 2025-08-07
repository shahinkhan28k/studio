
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
import { Home, Users, ClipboardList, Bell, Settings, Percent, ArrowDownToLine, ArrowUpFromLine, TrendingUp } from "lucide-react"
import React from "react"
import { AppProvider } from "@/context/app-context"
import { AdminHeader } from "@/components/admin-header"
import { AdminAuthProvider, useAdminAuth } from "@/hooks/use-admin-auth"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"


function AdminPagesLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useAuth()
  const { adminEmails } = useAdminAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!userLoading && user) {
      if (!adminEmails.includes(user.email?.toLowerCase() ?? '')) {
        router.push('/')
      }
    } else if (!userLoading && !user) {
       router.push('/')
    }
  }, [user, userLoading, adminEmails, router])

  if (userLoading || !user || !adminEmails.includes(user.email?.toLowerCase() ?? '')) {
    return <div className="container py-6">Loading or redirecting...</div>
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
                    <SidebarMenuButton href="/admin/investments" tooltip="Investments">
                        <TrendingUp />
                        <span>Investments</span>
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
                    <SidebarGroupLabel>Transactions</SidebarGroupLabel>
                    <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/transactions/deposits" tooltip="Deposits">
                        <ArrowDownToLine />
                        <span>Deposits</span>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/transactions/withdrawals" tooltip="Withdrawals">
                        <ArrowUpFromLine />
                        <span>Withdrawals</span>
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
            <AdminHeader />
            <main>{children}</main>
        </SidebarInset>
        </SidebarProvider>
  )
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
        <AppProvider>
            <AdminAuthProvider>
                <AdminPagesLayout>{children}</AdminPagesLayout>
            </AdminAuthProvider>
        </AppProvider>
    )
}
