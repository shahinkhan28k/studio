
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
import { useDeposits, DepositRecord } from "@/hooks/use-deposit"
import React from "react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { useAdminStats, UserInfo } from "@/hooks/use-admin-stats"

type DepositWithUser = DepositRecord & { userName: string | null }

export default function DepositsAdminPage() {
  const { deposits, updateDepositStatus } = useDeposits()
  const { allUsersData } = useAdminStats()
  const { toast } = useToast()
  const [depositsWithUsers, setDepositsWithUsers] = React.useState<DepositWithUser[]>([])

  React.useEffect(() => {
    if (deposits.length >= 0 && allUsersData.length >= 0) {
      const usersMap = new Map<string, UserInfo>(allUsersData.map(u => [u.uid, u]))
      const enrichedDeposits = deposits.map(deposit => ({
        ...deposit,
        userName: usersMap.get(deposit.userId)?.displayName ?? 'Unknown User'
      }))
      setDepositsWithUsers(enrichedDeposits)
    }
  }, [deposits, allUsersData])

  const handleUpdateStatus = (id: string, userId: string, amount: number, status: 'completed' | 'failed') => {
    try {
        updateDepositStatus(id, userId, amount, status)
        toast({
            title: "Deposit Updated",
            description: `Deposit status has been updated to ${status}.`
        })
    } catch(error: any) {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
        })
    }
  }

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
                <h1 className="text-3xl font-bold tracking-tight">Deposits</h1>
                <p className="text-muted-foreground">
                    View and manage all user deposits.
                </p>
            </div>
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Trx ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {depositsWithUsers.length > 0 ? (
              depositsWithUsers.map((deposit) => (
              <TableRow key={deposit.id}>
                <TableCell>{format(new Date(deposit.date), "PP p")}</TableCell>
                <TableCell>{deposit.userName} ({deposit.userId.substring(0,5)}...)</TableCell>
                <TableCell>{formatCurrency(deposit.amount, 'BDT')}</TableCell>
                <TableCell className="capitalize">{deposit.method}</TableCell>
                <TableCell>{deposit.transactionId || "N/A"}</TableCell>
                <TableCell>
                    <Badge variant={deposit.status === 'completed' ? 'default' : deposit.status === 'pending' ? 'secondary' : 'destructive'}>
                        {deposit.status}
                    </Badge>
                </TableCell>
                <TableCell>
                    {deposit.status === 'pending' && (
                        <div className="flex gap-2">
                             <Button size="sm" onClick={() => handleUpdateStatus(deposit.id, deposit.userId, deposit.amount, 'completed')}>Approve</Button>
                             <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(deposit.id, deposit.userId, deposit.amount, 'failed')}>Reject</Button>
                        </div>
                    )}
                </TableCell>
              </TableRow>
            ))
            ) : (
                <TableRow>
                    <TableCell colSpan={7} className="text-center">
                        No deposit data found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
