
"use client"

import Image from "next/image"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
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
import { useAppContext } from "@/context/app-context"
import { useNotices } from "@/hooks/use-notices"
import { useBanners } from "@/hooks/use-banners"


export default function HomePage() {
  const { language } = useAppContext()
  const { notices } = useNotices()
  const { banners } = useBanners()

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-8">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: false,
            }),
          ]}
        >
          <CarouselContent>
             {banners.map((banner, index) => (
              <CarouselItem key={banner.id}>
                <Card className="overflow-hidden rounded-xl shadow-lg">
                  <CardContent className="p-0">
                    <div className="aspect-video md:aspect-[2.4/1] relative">
                      <Image
                        src={banner.src}
                        alt={banner.alt}
                        fill
                        className="object-cover"
                        data-ai-hint={banner['data-ai-hint']}
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-4" />
          <CarouselNext className="hidden md:flex right-4" />
        </Carousel>

        <Card>
          <CardHeader>
            <CardTitle>{language.t('featuredTasksTitle')}</CardTitle>
            <CardDescription>
              {language.t('featuredTasksDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TasksClient showFeaturedOnly />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language.t('noticeBoardTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            {notices.length > 0 ? (
                <ul className="space-y-4">
                {notices.map((notice, index) => (
                    <React.Fragment key={notice.id}>
                    <li className="flex flex-col">
                        <p className="font-semibold">{notice.title}</p>
                        <p className="text-sm text-muted-foreground">{notice.description}</p>
                    </li>
                    {index < notices.length - 1 && <Separator />}
                    </React.Fragment>
                ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground">No notices at the moment.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
