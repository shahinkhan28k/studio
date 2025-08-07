
"use client"
import { AppHeader } from "@/components/app-header"
import { FooterNav } from "@/components/footer-nav"
import { AppProvider } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import React from "react"
import { AdminAuthProvider } from "@/hooks/use-admin-auth"

export default function AppLayout({
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
    // This will be handled by the AuthProvider's loading state now.
    // Return null to avoid rendering anything until auth state is confirmed.
    return null; 
  }
  
  return (
    <AppProvider>
        <AdminAuthProvider>
            <div className="relative flex min-h-screen flex-col">
                <AppHeader />
                <main className="flex-1">{children}</main>
                <FooterNav />
            </div>
        </AdminAuthProvider>
    </AppProvider>
  )
}
