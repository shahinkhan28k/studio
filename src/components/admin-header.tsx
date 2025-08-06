
"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
    MoreVertical, 
    LogOut, 
    Shield, 
    ArrowLeft,
    Bell,
    Users,
    ClipboardList,
    TrendingUp,
    Percent,
    ArrowDownToLine,
    ArrowUpFromLine,
    Settings
} from "lucide-react"
import { useAdminAuth } from "@/hooks/use-admin-auth"

export function AdminHeader() {
  const { logout } = useAdminAuth()

  const menuItems = [
    { href: "/admin/notices", label: "Notices", icon: Bell },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/tasks", label: "Tasks", icon: ClipboardList },
    { href: "/admin/investments", label: "Investments", icon: TrendingUp },
    { href: "/admin/referrals", label: "Referrals", icon: Percent },
    { href: "/admin/transactions/deposits", label: "Deposits", icon: ArrowDownToLine },
    { href: "/admin/transactions/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-14 items-center">
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Admin Panel
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Admin Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {menuItems.map((item) => (
                   <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to App
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
