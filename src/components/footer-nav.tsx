"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

const navItems = [
  { href: "/", label: "Home", icon: Icons.Home },
  { href: "/tasks", label: "Tasks", icon: Icons.Tasks },
  { href: "/refer", label: "Refer", icon: Icons.Refer },
  { href: "/profile", label: "Account", icon: Icons.Profile },
]

export function FooterNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <div className="h-16" /> {/* Spacer */}
      <footer className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex flex-col items-center justify-center px-5 hover:bg-muted",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </footer>
    </div>
  )
}
