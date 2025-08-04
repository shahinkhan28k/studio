import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"

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
            <CardTitle>Notice Board</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex flex-col">
                <p className="font-semibold">
                  New High-Value Tasks Available!
                </p>
                <p className="text-sm text-muted-foreground">
                  Check out the tasks section for new opportunities to earn more. Limited slots available!
                </p>
              </li>
              <Separator />
              <li className="flex flex-col">
                <p className="font-semibold">
                  Referral Program Boost
                </p>
                <p className="text-sm text-muted-foreground">
                  For a limited time, get a 10% bonus on your first-level referral commissions.
                </p>
              </li>
              <Separator />
              <li className="flex flex-col">
                <p className="font-semibold">
                  Scheduled Maintenance
                </p>
                <p className="text-sm text-muted-foreground">
                  The platform will be down for scheduled maintenance on Sunday at 2 AM UTC.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
