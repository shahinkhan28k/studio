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
