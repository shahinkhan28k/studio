
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
import { useNotices } from "@/hooks/use-notices"
import { format } from "date-fns"

export default function NoticesAdminPage() {
  const { notices, deleteNotice } = useNotices()

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      deleteNotice(id)
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
                <h1 className="text-3xl font-bold tracking-tight">Notice Board</h1>
                <p className="text-muted-foreground">Manage notices for all users.</p>
            </div>
        </div>
        <Button asChild>
          <Link href="/admin/notices/new">Add Notice</Link>
        </Button>
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
            {notices.length > 0 ? (
              notices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell>{notice.id}</TableCell>
                  <TableCell>{notice.title}</TableCell>
                  <TableCell>{format(new Date(notice.createdAt), "PP")}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2" asChild>
                        <Link href={`/admin/notices/${notice.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(notice.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No notices found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
