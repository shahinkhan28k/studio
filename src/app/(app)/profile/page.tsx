
"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useUserStats, UserStats } from "@/hooks/use-user-stats"
import { useAppContext } from "@/context/app-context"
import { formatCurrency } from "@/lib/utils"
import React from "react"
import { useAuth } from "@/context/auth-context"
import { useSettings } from "@/hooks/use-settings"
import { Badge } from "@/components/ui/badge"
import { useLuckyDraw } from "@/hooks/use-lucky-draw"

const defaultStats: UserStats = {
  totalEarnings: 0,
  totalDeposit: 0,
  totalWithdraw: 0,
  totalInvestment: 0,
  availableBalance: 0,
  todaysEarnings: 0,
}

export default function ProfilePage() {
  const { stats } = useUserStats()
  const { language, currency } = useAppContext()
  const { user } = useAuth();
  const { settings } = useSettings();
  const { spins } = useLuckyDraw();
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, []);

  const profileMenuItems = [
    { title: language.t('deposit'), href: "/profile/deposit", icon: Icons.Deposit },
    { title: language.t('withdraw'), href: "/profile/withdraw", icon: Icons.Withdraw },
    { title: language.t('myInvestments'), href: "/profile/my-investments", icon: Icons.Briefcase },
    { 
      title: "লাকি ড্র", 
      href: "/profile/lucky-draw", 
      icon: Icons.Gift, 
      show: settings.luckyDrawEnabled,
      badge: spins > 0 ? spins : null,
    },
    { title: language.t('collaboration'), href: "/refer", icon: Icons.Refer },
    { title: language.t('accountDetails'), href: "/profile/account", icon: Icons.Profile },
    {
      title: language.t('personalInformation'),
      href: "/profile/info",
      icon: Icons.Settings,
    },
    { title: language.t('helpSupport'), href: "/profile/help", icon: Icons.HelpCircle }, 
  ]


  return (
    <div className="container py-6">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.photoURL ?? "https://placehold.co/100x100.png"} alt={user?.displayName ?? "User"} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user?.displayName || "User"}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-2 gap-4">
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-normal">{language.t('availableBalance')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-primary">{isClient ? formatCurrency(stats.availableBalance, currency) : '...'}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-normal">{language.t('todaysEarnings')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{isClient ? formatCurrency(stats.todaysEarnings, currency) : '...'}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-normal">{language.t('totalEarnings')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{isClient ? formatCurrency(stats.totalEarnings, currency) : '...'}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-normal">{language.t('totalInvestment')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{isClient ? formatCurrency(stats.totalInvestment, currency) : '...'}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-normal">{language.t('totalDeposit')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{isClient ? formatCurrency(stats.totalDeposit, currency) : '...'}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-normal">{language.t('totalWithdraw')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{isClient ? formatCurrency(stats.totalWithdraw, currency) : '...'}</p>
                </CardContent>
            </Card>
        </div>


        <Card>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {profileMenuItems.map((item) => (
                (item.show === undefined || item.show) && (
                  <li key={item.title}>
                    <Link href={item.href} passHref>
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-12"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-muted-foreground" />
                          <span>{item.title}</span>
                          {item.badge && <Badge variant="destructive">{item.badge}</Badge>}
                        </div>
                        <Icons.ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </CardContent>
        </Card>

        <Button variant="destructive">
          <Icons.Logout className="mr-2 h-4 w-4" />
          {language.t('logOut')}
        </Button>
      </div>
    </div>
  )
}
