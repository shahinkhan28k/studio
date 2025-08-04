
"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useUserStats } from "@/hooks/use-user-stats"

const initialTasks = [
  { id: 1, title: "Survey Completion", description: "Complete a short survey about your shopping habits.", reward: 5.00, completed: false, isFeatured: true, showAd: true, duration: 15 },
  { id: 2, title: "App Download", description: "Download and install our partner's new mobile app.", reward: 10.00, completed: false, isFeatured: true, showAd: true, duration: 30 },
  { id: 3, title: "Watch a Video Ad", description: "Watch a 30-second promotional video.", reward: 2.50, completed: false, isFeatured: false, showAd: true, duration: 30 },
  { id: 4, title: "Social Media Share", description: "Share our promotional post on your social media profile.", reward: 7.50, completed: false, isFeatured: false, showAd: false, duration: 0 },
  { id: 5, title: "Product Review", description: "Write a review for a product you recently purchased.", reward: 12.00, completed: false, isFeatured: true, showAd: true, duration: 20 },
  { id: 6, title: "Data Entry Task", description: "Enter data from a scanned document into a spreadsheet.", reward: 15.00, completed: false, isFeatured: false, showAd: false, duration: 0 },
]

type Task = typeof initialTasks[0];

type TasksClientProps = {
  showFeaturedOnly?: boolean
}

export function TasksClient({ showFeaturedOnly = false }: TasksClientProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isAdOpen, setIsAdOpen] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const { toast } = useToast()
  const { addEarning } = useUserStats()


  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isAdOpen && selectedTask && selectedTask.duration > 0) {
      setCountdown(selectedTask.duration)
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer)
            return 0
          }
          return prevCountdown - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isAdOpen, selectedTask])


  const handleCompleteClick = (task: Task) => {
    if (task.showAd) {
      setSelectedTask(task)
      setIsAdOpen(true)
    } else {
      completeTask(task.id, task.reward)
    }
  }

  const completeTask = (taskId: number, reward: number) => {
     setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
    
    addEarning(reward);

    toast({
      title: "Task Completed!",
      description: `You've earned $${reward.toFixed(2)}. Your balance will be updated shortly.`,
      variant: "default",
    })
  }

  const handleAdClose = () => {
    if (selectedTask) {
      completeTask(selectedTask.id, selectedTask.reward)
    }
    setIsAdOpen(false)
    setSelectedTask(null)
    setCountdown(0)
  }

  const displayedTasks = useMemo(() => {
    if (showFeaturedOnly) {
      return tasks.filter(task => task.isFeatured)
    }
    return tasks
  }, [tasks, showFeaturedOnly])

  return (
    <>
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
                onClick={() => handleCompleteClick(task)}
                disabled={task.completed}
              >
                {task.completed ? "সম্পন্ন" : "কাজটি সম্পন্ন করুন"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {selectedTask && (
        <AlertDialog open={isAdOpen} onOpenChange={setIsAdOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Advertisement</AlertDialogTitle>
              <AlertDialogDescription>
                Your task will be marked as complete after the ad is finished. 
                This space can be used to display ads from networks like AdSense or Adsterra.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex items-center justify-center h-48 bg-muted rounded-md">
              <p className="text-muted-foreground">[Ad Content Placeholder]</p>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleAdClose} disabled={countdown > 0}>
                {countdown > 0 ? `Please wait ${countdown}s` : "Close Ad & Complete Task"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
