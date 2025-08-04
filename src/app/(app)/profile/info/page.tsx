
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const infoFormSchema = z.object({
  bio: z.string().max(250, "Bio cannot be more than 250 characters."),
})

type InfoFormValues = z.infer<typeof infoFormSchema>

const user = {
  bio: "I am a dedicated task completer on this platform, always looking for new opportunities to earn.",
}

export default function PersonalInfoPage() {
  const { toast } = useToast()
  const form = useForm<InfoFormValues>({
    resolver: zodResolver(infoFormSchema),
    defaultValues: {
      bio: user.bio,
    },
  })

  function onSubmit(data: InfoFormValues) {
    toast({
      title: "Information Updated",
      description: "Your personal information has been successfully updated.",
    })
  }

  return (
    <div className="container py-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/profile">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your bio and other personal details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
