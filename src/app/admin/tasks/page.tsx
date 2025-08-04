
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

const tasks = [
  { id: 1, title: "Survey Completion", reward: 5.0, isFeatured: true, status: "Active" },
  { id: 2, title: "App Download", reward: 10.0, isFeatured: true, status: "Active" },
  { id: 3, title: "Watch a Video Ad", reward: 2.5, isFeatured: false, status: "Active" },
  { id: 4, title: "Social Media Share", reward: 7.5, isFeatured: false, status: "Inactive" },
];

export default function TasksAdminPage() {
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
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>${task.reward.toFixed(2)}</TableCell>
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
