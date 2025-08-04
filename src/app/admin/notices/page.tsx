
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

const notices = [
  { id: 1, title: "New high-value tasks available!", createdAt: "2024-07-28" },
  { id: 2, title: "Referral Program Boost", createdAt: "2024-07-27" },
  { id: 3, title: "Scheduled Maintenance", createdAt: "2024-07-26" },
];

export default function NoticesAdminPage() {
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notice Board</h1>
          <p className="text-muted-foreground">Manage notices for all users.</p>
        </div>
        <Button>Add Notice</Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Notice ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell>{notice.id}</TableCell>
                <TableCell>{notice.title}</TableCell>
                <TableCell>{notice.createdAt}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
