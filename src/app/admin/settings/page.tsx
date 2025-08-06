"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useBanners } from "@/hooks/use-banners"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"

export default function SettingsPage() {
  const { toast } = useToast()
  const { banners, deleteBanner } = useBanners()

  const handleDeleteBanner = (id: string) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      deleteBanner(id)
      toast({
        title: "Banner Deleted",
        description: "The banner has been successfully deleted.",
      })
    }
  }

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
                <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
                <p className="text-muted-foreground">Manage your website's configuration.</p>
            </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Homepage Banner Settings</CardTitle>
          <CardDescription>Manage the promotional banners on the homepage carousel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Banners</CardTitle>
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
                                  <Button variant="destructive" size="sm" onClick={() => handleDeleteBanner(banner.id)}>Delete</Button>
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
        </CardContent>
      </Card>
    </div>
  )
}
