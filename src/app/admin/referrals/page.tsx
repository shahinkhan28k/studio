
"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useAdminStats } from "@/hooks/use-admin-stats"
import { formatCurrency } from "@/lib/utils"
import React from "react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function ReferralsAdminPage() {
  const { referralDetails } = useAdminStats()
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
                <h1 className="text-3xl font-bold tracking-tight">Referrals</h1>
                <p className="text-muted-foreground">
                    View and manage all user referrals.
                </p>
            </div>
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Referred By</TableHead>
              <TableHead className="text-center">Total Referrals</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isClient && referralDetails.length > 0 ? (
              referralDetails.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>{user.displayName || "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.referrerName || "N/A"}</TableCell>
                <TableCell className="text-center">
                    <Badge variant="secondary">{user.referralCount}</Badge>
                </TableCell>
              </TableRow>
            ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">
                        {isClient ? "No referral data found." : "Loading..."}
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
