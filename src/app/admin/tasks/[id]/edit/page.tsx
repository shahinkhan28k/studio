
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTasks, Task, TaskFormValues } from "@/hooks/use-tasks"


const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  reward: z.coerce.number().positive("Reward must be a positive number."),
  taskLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  showAd: z.boolean().default(false),
  duration: z.coerce.number().int().min(0).default(0),
  status: z.enum(["Active", "Inactive"]),
  adLink: z.string().optional(),
})


export default function EditTaskPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const { updateTask, getTaskById, tasks: allTasks } = useTasks()
  const [task, setTask] = React.useState<Task | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  const taskId = params.id as string;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
  })
  
  React.useEffect(() => {
    // We need to wait until allTasks are loaded from localStorage
    if (allTasks.length > 0 && taskId) {
      setLoading(true);
      const taskData = getTaskById(taskId);
      if (taskData) {
        setTask(taskData);
        form.reset(taskData);
      }
      setLoading(false);
    } else if (taskId && allTasks.length === 0) {
      // Still waiting for tasks to load, do nothing until they are loaded.
      setLoading(true);
    } else if (!taskId) {
      setLoading(false);
    }
  }, [taskId, getTaskById, form, allTasks]);

  async function onSubmit(data: TaskFormValues) {
    if (!taskId) return;
    updateTask(taskId, data)
    toast({
      title: "Task Updated",
      description: "The task has been successfully updated.",
    })
    router.push("/admin/tasks")
  }

  if (loading) {
      return <div className="container py-6">Loading task...</div>;
  }
  
  if (!task) {
      return (
          <div className="container py-6">
              <p>Task not found.</p>
              <Button variant="link" asChild>
                  <Link href="/admin/tasks">Go back</Link>
              </Button>
          </div>
      )
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Task</h1>
            <p className="text-muted-foreground">Update the details of the task below.</p>
        </div>
         <Button variant="outline" asChild>
          <Link href="/admin/tasks">Cancel</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Watch a promotional video" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a brief description of the task."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 5.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taskLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/task-url" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription>
                      If provided, the user will be redirected to this URL when they click the complete button.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select task status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Task</FormLabel>
                        <FormDescription>
                            Featured tasks appear on the homepage.
                        </FormDescription>
                        </div>
                        <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="showAd"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                        <FormLabel className="text-base">Show Advertisement</FormLabel>
                        <FormDescription>
                            Require user to watch an ad to complete.
                        </FormDescription>
                        </div>
                        <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        </FormControl>
                    </FormItem>
                    )}
                />
              </div>
              
              {form.watch("showAd") && (
                <div className="space-y-8">
                    <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Ad Duration (seconds)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g. 30" {...field} />
                        </FormControl>
                        <FormDescription>
                            The number of seconds the user must watch the ad.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                        control={form.control}
                        name="adLink"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Advertisement Link</FormLabel>
                            <FormControl>
                                <Input placeholder="https://ad.example.com" {...field} value={field.value ?? ""} />
                            </FormControl>
                             <FormDescription>
                                Enter the link for the advertisement (e.g. from AdSense or Adsterra).
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
              )}

              <Button type="submit">Update Task</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
