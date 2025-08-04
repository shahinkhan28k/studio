
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
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
import { useToast } from "@/hooks/use-toast"
import { useBanners, Banner } from "@/hooks/use-banners"
import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"

const bannerFormSchema = z.object({
  src: z.string().url({ message: "Please enter a valid URL." }),
  alt: z.string().min(1, "Alt text is required."),
  "data-ai-hint": z.string().min(1, "AI hint is required."),
})

export type BannerFormValues = z.infer<typeof bannerFormSchema>

export default function HomepageAdminPage() {
  const { toast } = useToast()
  const { banners, addBanner, deleteBanner } = useBanners()

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      src: "",
      alt: "",
      "data-ai-hint": "",
    },
  })

  function onSubmit(data: BannerFormValues) {
    addBanner(data)
    toast({
      title: "Banner Added",
      description: "The new banner has been successfully added.",
    })
    form.reset()
  }
  
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      deleteBanner(id)
    }
  }

  return (
    <div className="container py-6 space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Homepage Management</h1>
            <p className="text-muted-foreground">Manage the content displayed on the homepage.</p>
        </div>
      <Card>
        <CardHeader>
            <CardTitle>Add New Banner</CardTitle>
            <CardDescription>Add a new promotional banner to the homepage carousel.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="src"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://placehold.co/1200x500.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Promotional Banner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="data-ai-hint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Hint</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. digital marketing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add Banner</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Current Banners</CardTitle>
          <CardDescription>List of banners currently on the homepage.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Alt Text</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {banners.length > 0 ? (
                    banners.map((banner) => (
                        <TableRow key={banner.id}>
                        <TableCell>
                            <Image src={banner.src} alt={banner.alt} width={100} height={40} className="object-cover rounded-md" />
                        </TableCell>
                        <TableCell>{banner.alt}</TableCell>
                        <TableCell>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(banner.id)}>Delete</Button>
                        </TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center">No banners found.</TableCell>
                    </TableRow>
                    )}
                </TableBody>
            </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
