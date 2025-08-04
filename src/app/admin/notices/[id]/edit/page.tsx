
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useNotices } from "@/hooks/use-notices"
import React from "react"

const noticeFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
})

export type NoticeFormValues = z.infer<typeof noticeFormSchema>

export default function EditNoticePage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const { updateNotice, getNoticeById } = useNotices()
  
  const noticeId = Number(params.id)
  const notice = getNoticeById(noticeId)

  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })
  
  React.useEffect(() => {
    if (notice) {
      form.reset(notice)
    }
  }, [notice, form])

  function onSubmit(data: NoticeFormValues) {
    updateNotice(noticeId, data)
    toast({
      title: "Notice Updated",
      description: "The notice has been successfully updated.",
    })
    router.push("/admin/notices")
  }

  if (!notice) {
    return (
        <div className="container py-6">
            <p>Notice not found.</p>
            <Button variant="link" asChild>
                <Link href="/admin/notices">Go back</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Notice</h1>
          <p className="text-muted-foreground">Update the notice details below.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/notices">Cancel</Link>
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
                    <FormLabel>Notice Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the notice title" {...field} />
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
                    <FormLabel>Notice Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide the full content of the notice."
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update Notice</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
