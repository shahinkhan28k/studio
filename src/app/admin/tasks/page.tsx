
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
import { useTasks } from "@/hooks/use-tasks"
import { formatCurrency } from "@/lib/utils"

export default function TasksAdminPage() {
  const { tasks, deleteTask } = useTasks()

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(id)
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
                <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                <p className="text-muted-foreground">Manage tasks for users.</p>
            </div>
        </div>
        <Button asChild>
          <Link href="/admin/tasks/new">Add Task</Link>
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Is Featured</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {tasks.length > 0 ? (
                tasks.map((task) => (
                <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{formatCurrency(task.reward, 'USD')}</TableCell>
                    <TableCell>
                    <Badge variant={task.isFeatured ? "default" : "outline"}>
                        {task.isFeatured ? "Yes" : "No"}
                    </Badge>
                    </TableCell>
                    <TableCell>
                    <Badge variant={task.status === "Active" ? "default" : "secondary"}>
                        {task.status}
                    </Badge>
                    </TableCell>
                    <TableCell>
                    <Button variant="outline" size="sm" className="mr-2" asChild>
                        <Link href={`/admin/tasks/${task.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(task.id)}>Delete</Button>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                 <TableRow>
                    <TableCell colSpan={6} className="text-center">No tasks found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
