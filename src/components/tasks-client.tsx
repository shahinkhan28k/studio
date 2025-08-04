
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
import { cn, formatCurrency } from "@/lib/utils"
import { useUserStats } from "@/hooks/use-user-stats"
import { useAppContext } from "@/context/app-context"
import { useTasks, Task } from "@/hooks/use-tasks"

type TasksClientProps = {
  showFeaturedOnly?: boolean
}

export function TasksClient({ showFeaturedOnly = false }: TasksClientProps) {
  const { tasks: allTasks, completeTask: markTaskAsComplete } = useTasks()
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<number>>(new Set());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isAdOpen, setIsAdOpen] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const { toast } = useToast()
  const { addEarning } = useUserStats()
  const { language, currency } = useAppContext()


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
    if (task.taskLink) {
      window.open(task.taskLink, '_blank');
    }
    
    if (task.showAd) {
      setSelectedTask(task)
      setIsAdOpen(true)
    } else {
      completeTask(task.id, task.reward)
    }
  }

  const completeTask = (taskId: number, reward: number) => {
    setCompletedTaskIds(prev => new Set(prev).add(taskId))
    addEarning(reward);

    toast({
      title: language.t('taskCompletedTitle'),
      description: `${language.t('taskCompletedDescription')} ${formatCurrency(reward, currency)}.`,
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
    const activeTasks = allTasks.filter(task => task.status === 'Active');
    if (showFeaturedOnly) {
      return activeTasks.filter(task => task.isFeatured)
    }
    return activeTasks
  }, [allTasks, showFeaturedOnly])

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayedTasks.map((task) => (
          <Card key={task.id} className={cn("flex flex-col transition-opacity duration-500", completedTaskIds.has(task.id) && "opacity-50")}>
            <CardHeader>
              <CardTitle>{task.title}</CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-lg font-bold text-primary">{formatCurrency(task.reward, currency)}</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => handleCompleteClick(task)}
                disabled={completedTaskIds.has(task.id)}
              >
                {completedTaskIds.has(task.id) ? language.t('completed') : language.t('completeTheTask')}
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
              {selectedTask.adLink ? (
                <iframe src={selectedTask.adLink} className="w-full h-full" />
              ) : (
                <p className="text-muted-foreground">[Ad Content Placeholder]</p>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleAdClose} disabled={countdown > 0}>
                {countdown > 0 ? `${language.t('pleaseWait')} ${countdown}s` : language.t('closeAdAndComplete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
