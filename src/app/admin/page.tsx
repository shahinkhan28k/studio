
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, Users, Activity, ArrowDownToLine, ArrowUpFromLine } from "lucide-react"
import { useAdminStats } from "@/hooks/use-admin-stats"
import { formatCurrency } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from "react"
import { useAppContext } from "@/context/app-context"

export default function AdminPage() {
  const { stats, recentSignups } = useAdminStats()
  const [isClient, setIsClient] = React.useState(false)
  const { currency } = useAppContext();

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="container py-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isClient ? `+${stats.totalUsers}` : "..."}</div>
            <p className="text-xs text-muted-foreground">
              Total registered users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deposits
            </CardTitle>
            <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isClient ? formatCurrency(stats.totalDeposits, currency) : "..."}</div>
            <p className="text-xs text-muted-foreground">
              Total deposits made by users
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Withdrawals
            </CardTitle>
            <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isClient ? formatCurrency(stats.totalWithdrawals, currency) : "..."}</div>
            <p className="text-xs text-muted-foreground">
              Total withdrawals by users
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
           <p>Chart placeholder</p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>
              {isClient ? `You have ${recentSignups.length} new signups.` : "..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isClient ? (
                <div className="space-y-4">
                  {recentSignups.length > 0 ? (
                    recentSignups.slice(0, 5).map((user) => (
                      <div key={user.uid} className="flex items-center">
                        <Avatar className="h-9 w-9">
                           <AvatarImage src={user.photoURL || "https://placehold.co/100x100.png"} alt="Avatar" />
                          <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{user.displayName || 'New User'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No new signups.</p>
                  )}
                </div>
            ) : (
              <p>Loading...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
