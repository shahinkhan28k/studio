import { TasksClient } from "@/components/tasks-client"

export default function TasksPage() {
  return (
    <div className="container py-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Available Tasks</h1>
        <p className="text-muted-foreground">
          Complete tasks to earn rewards. Your earnings will be added to your profile balance.
        </p>
      </div>
      <div className="mt-8">
        <TasksClient />
      </div>
    </div>
  )
}
