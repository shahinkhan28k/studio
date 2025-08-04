
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

const users = [
  {
    id: "USR001",
    name: "John Doe",
    email: "john.doe@example.com",
    balance: 1500.75,
    status: "Active",
  },
  {
    id: "USR002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    balance: 250.0,
    status: "Active",
  },
  {
    id: "USR003",
    name: "Sam Wilson",
    email: "sam.wilson@example.com",
    balance: 0,
    status: "Inactive",
  },
]

export default function UsersPage() {
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage all registered users on the platform.
          </p>
        </div>
        <Button>Add User</Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>${user.balance.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
