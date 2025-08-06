
"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MoreVertical } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-14 items-center">
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
        </div>
        <div className="flex items-center space-x-2">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href="/admin">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin/notices">Notices</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/admin/users">Users</Link>
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin/tasks">Tasks</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/admin/investments">Investments</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/admin/referrals">Referrals</Link>
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin/transactions/deposits">Deposits</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/admin/transactions/withdrawals">Withdrawals</Link>
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin/settings">Settings</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
