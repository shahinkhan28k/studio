
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

export default function UsersPage() {
  const { allUsersData, deleteUser } = useAdminStats()
  const { toast } = useToast()
  
  const handleDeleteUser = async (uid: string, name: string | null) => {
    if (confirm(`Are you sure you want to delete user: ${name || uid}? This action cannot be undone.`)) {
        try {
            deleteUser(uid);
            toast({
                title: "User Deleted",
                description: `User ${name || uid} has been permanently deleted.`
            })
        } catch (error) {
            console.error("Failed to delete user:", error);
            toast({
                title: "Error",
                description: "Failed to delete user.",
                variant: "destructive"
            });
        }
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
            {allUsersData.length > 0 ? (
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
                   <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteUser(user.uid, user.displayName)}
                    >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">
                        No users found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
