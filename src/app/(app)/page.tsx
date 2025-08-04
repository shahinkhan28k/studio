
"use client"

import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import { TasksClient } from "@/components/tasks-client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const withdrawalUsers = Array.from({ length: 100 }, (_, i) => `User ${i + 1}`)

export default function HomePage() {
  return (
    <div className="container py-6">
      <div className="flex flex-col gap-8">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={index}>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video md:aspect-[2.4/1] relative">
                      <Image
                        src={`https://placehold.co/1200x500.png`}
                        alt={`Banner ${index + 1}`}
                        fill
                        className="object-cover"
                        data-ai-hint="abstract background"
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        <Card>
          <CardHeader>
            <CardTitle>লাভজনক কাজগুলো</CardTitle>
            <CardDescription>
              এই কাজগুলো সম্পূর্ণ করে আরও বেশি উপার্জন করুন।
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TasksClient showFeaturedOnly />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>আজকের উত্তোলন</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-4">
              {withdrawalUsers.slice(0, 5).map((user, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {user} made a withdrawal.
                </li>
              ))}
            </ul>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Show More
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>আজকের উত্তোলন</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-72 w-full rounded-md border">
                  <div className="p-4">
                    <ul className="space-y-2">
                      {withdrawalUsers.map((user, index) => (
                        <li key={index} className="text-sm">
                          {user} made a withdrawal.
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>নোটিশ বোর্ড</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex flex-col">
                <p className="font-semibold">
                  নতুন উচ্চ-মূল্যের কাজ পাওয়া যাচ্ছে!
                </p>
                <p className="text-sm text-muted-foreground">
                  আরও বেশি উপার্জনের সুযোগের জন্য টাস্ক বিভাগটি দেখুন। সীমিত সংখ্যক স্লট পাওয়া যাচ্ছে!
                </p>
              </li>
              <Separator />
              <li className="flex flex-col">
                <p className="font-semibold">
                  রেফারেল প্রোগ্রাম বুস্ট
                </p>
                <p className="text-sm text-muted-foreground">
                  সীমিত সময়ের জন্য, আপনার প্রথম-স্তরের রেফারেল কমিশনগুলিতে ১০% বোনাস পান।
                </p>
              </li>
              <Separator />
              <li className="flex flex-col">
                <p className="font-semibold">
                  পূর্বনির্ধারিত রক্ষণাবেক্ষণ
                </p>
                <p className="text-sm text-muted-foreground">
                  প্ল্যাটফর্মটি রবিবার দুপুর ২টা UTC-তে নির্ধারিত রক্ষণাবেক্ষণের জন্য ডাউন থাকবে।
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
