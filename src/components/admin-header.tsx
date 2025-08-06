
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
import { MoreVertical, LogOut, Shield } from "lucide-react"

export function AdminHeader() {

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-14 items-center">
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Admin Panel</h1>
        </div>
        <div className="flex items-center space-x-2">
           <Button asChild variant="outline">
              <Link href="/">Back to App</Link>
            </Button>
        </div>
      </div>
    </header>
  )
}
