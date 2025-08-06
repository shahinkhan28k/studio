
"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MoreVertical, LogOut } from "lucide-react"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function AdminHeader() {
    const { admin, logout } = useAdminAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = () => {
        logout();
        toast({ title: "Logged Out", description: "You have been logged out from the admin panel." });
        router.push("/admin/login");
    }

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
                <DropdownMenuLabel>{admin?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin">Dashboard</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/admin/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
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
