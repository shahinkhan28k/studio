
"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useAdminStats } from "@/hooks/use-admin-stats"
import { formatCurrency } from "@/lib/utils"
import React from "react"

export default function UsersPage() {
  const { allUsersData } = useAdminStats()
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                    <ChevronLeft />
                </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground">
                    Manage all registered users on the platform.
                </p>
            </div>
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isClient && allUsersData.length > 0 ? (
              allUsersData.map((user) => (
              <TableRow key={user.uid}>
                <TableCell className="font-mono text-xs">{user.uid}</TableCell>
                <TableCell>{user.displayName || "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatCurrency(user.stats.availableBalance, 'USD')}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2" disabled>
                    Edit
                  </Button>
                   <Button variant="destructive" size="sm" disabled>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">
                        {isClient ? "No users found." : "Loading..."}
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
