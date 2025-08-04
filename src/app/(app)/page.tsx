
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


const banners = [
    {
        src: "https://placehold.co/1200x500.png",
        alt: "Promotional Banner 1",
        "data-ai-hint": "digital marketing"
    },
    {
        src: "https://placehold.co/1200x500.png",
        alt: "Promotional Banner 2",
        "data-ai-hint": "online earnings"
    },
    {
        src: "https://placehold.co/1200x500.png",
        alt: "Promotional Banner 3",
        "data-ai-hint": "successful teamwork"
    }
]


export default function HomePage() {
  const { language } = useAppContext()

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
              <CarouselItem key={index}>
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
            <ul className="space-y-4">
              <li className="flex flex-col">
                <p className="font-semibold">
                  {language.t('notice1Title')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language.t('notice1Description')}
                </p>
              </li>
              <Separator />
              <li className="flex flex-col">
                <p className="font-semibold">
                  {language.t('notice2Title')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language.t('notice2Description')}
                </p>
              </li>
              <Separator />
              <li className="flex flex-col">
                <p className="font-semibold">
                 {language.t('notice3Title')}
                </p>
                <p className="text-sm text-muted-foreground">
                 {language.t('notice3Description')}
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
