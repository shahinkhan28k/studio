
"use client"
import { TasksClient } from "@/components/tasks-client"
import { useAppContext } from "@/context/app-context";

export default function TasksPage() {
  const { language } = useAppContext();
  return (
    <div className="container py-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{language.t('availableTasksTitle')}</h1>
        <p className="text-muted-foreground">
          {language.t('availableTasksDescription')}
        </p>
      </div>
      <div className="mt-8">
        <TasksClient />
      </div>
    </div>
  )
}
