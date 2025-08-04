"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const initialTasks = [
  { id: 1, title: "Survey Completion", description: "Complete a short survey about your shopping habits.", reward: 5.00, completed: false, isFeatured: true },
  { id: 2, title: "App Download", description: "Download and install our partner's new mobile app.", reward: 10.00, completed: false, isFeatured: true },
  { id: 3, title: "Watch a Video Ad", description: "Watch a 30-second promotional video.", reward: 2.50, completed: false, isFeatured: false },
  { id: 4, title: "Social Media Share", description: "Share our promotional post on your social media profile.", reward: 7.50, completed: false, isFeatured: false },
  { id: 5, title: "Product Review", description: "Write a review for a product you recently purchased.", reward: 12.00, completed: false, isFeatured: true },
  { id: 6, title: "Data Entry Task", description: "Enter data from a scanned document into a spreadsheet.", reward: 15.00, completed: false, isFeatured: false },
]

type TasksClientProps = {
  showFeaturedOnly?: boolean
}

export function TasksClient({ showFeaturedOnly = false }: TasksClientProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const { toast } = useToast()

  const handleCompleteTask = (taskId: number, reward: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );

    toast({
      title: "Task Completed!",
      description: `You've earned $${reward.toFixed(2)}. Your balance will be updated shortly.`,
      variant: "default",
    })
  }

  const displayedTasks = useMemo(() => {
    if (showFeaturedOnly) {
      return tasks.filter(task => task.isFeatured)
    }
    return tasks
  }, [tasks, showFeaturedOnly])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {displayedTasks.map((task) => (
        <Card key={task.id} className={cn("flex flex-col transition-opacity duration-500", task.completed && "opacity-50")}>
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
            <CardDescription>{task.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-lg font-bold text-primary">${task.reward.toFixed(2)}</p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => handleCompleteTask(task.id, task.reward)}
              disabled={task.completed}
            >
              {task.completed ? "সম্পন্ন" : "কাজটি সম্পন্ন করুন"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
