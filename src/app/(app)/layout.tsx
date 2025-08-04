
import { AppHeader } from "@/components/app-header"
import { FooterNav } from "@/components/footer-nav"
import { AppProvider } from "@/context/app-context"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppProvider>
      <div className="relative flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1">{children}</main>
        <FooterNav />
      </div>
    </AppProvider>
  )
}
