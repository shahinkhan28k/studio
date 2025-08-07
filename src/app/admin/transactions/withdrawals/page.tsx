
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
import React from "react"
import { useWithdrawals, WithdrawalRecordWithUser } from "@/hooks/use-withdrawals"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function WithdrawalsAdminPage() {
  const { withdrawals, updateWithdrawalStatus } = useWithdrawals()
  const { toast } = useToast()

  const handleUpdateStatus = (withdrawalId: string, userId: string, status: 'completed' | 'failed') => {
    try {
      const withdrawal = withdrawals.find(w => w.id === withdrawalId);
      if(!withdrawal) throw new Error("Withdrawal not found");
      
      const totalAmount = withdrawal.amount + withdrawal.fee;
      updateWithdrawalStatus(withdrawalId, userId, totalAmount, status)
      toast({
        title: "Withdrawal Updated",
        description: `Withdrawal status has been updated to ${status}.`
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const renderDetails = (withdrawal: WithdrawalRecordWithUser) => {
    if (!withdrawal.details) return "N/A";
    
    switch(withdrawal.method) {
        case 'bkash':
        case 'nagad':
        case 'rocket':
            return withdrawal.details.walletNumber || "N/A";
        case 'usdt':
            return withdrawal.details.usdtAddress || "N/A";
        case 'bank':
            return (
                <div className="text-xs">
                    <p><strong>Bank:</strong> {withdrawal.details.bankName}</p>
                    <p><strong>Name:</strong> {withdrawal.details.accountHolderName}</p>
                    <p><strong>Acct:</strong> {withdrawal.details.bankAccountNumber}</p>
                </div>
            )
        default:
            return "N/A";
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
                <h1 className="text-3xl font-bold tracking-tight">Withdrawals</h1>
                <p className="text-muted-foreground">
                    View and manage all user withdrawals.
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
              <TableHead>Fee</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Wallet/Account Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.length > 0 ? (
              withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>{format(new Date(withdrawal.date), "PP p")}</TableCell>
                  <TableCell>{withdrawal.userName} ({withdrawal.userId.substring(0,5)}...)</TableCell>
                  <TableCell>{formatCurrency(withdrawal.amount, 'BDT')}</TableCell>
                  <TableCell>{formatCurrency(withdrawal.fee, 'BDT')}</TableCell>
                  <TableCell className="capitalize">{withdrawal.method}</TableCell>
                  <TableCell>{renderDetails(withdrawal)}</TableCell>
                  <TableCell>
                    <Badge variant={withdrawal.status === 'completed' ? 'default' : withdrawal.status === 'pending' ? 'secondary' : 'destructive'}>
                        {withdrawal.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {withdrawal.status === 'pending' && (
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleUpdateStatus(withdrawal.id, withdrawal.userId, 'completed')}>Approve</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(withdrawal.id, withdrawal.userId, 'failed')}>Reject</Button>
                        </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                  <TableCell colSpan={8} className="text-center">
                      No withdrawal data found.
                  </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
