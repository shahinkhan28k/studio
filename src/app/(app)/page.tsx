
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
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from "@/context/app-context"
import { formatCurrency } from "@/lib/utils"

const withdrawalUsers = [
  "Abdullah Al Mamun", "Fatima Akter", "Rahim Ahmed", "Sadia Islam", "Kamal Hossain",
  "Nusrat Jahan", "Jamal Uddin", "Ayesha Siddika", "Fahim Chowdhury", "Sumaiya Khatun",
  "Rofiq Islam", "Jannatul Ferdous", "Mehedi Hasan", "Sultana Razia", "Arif Khan"
];

const maskUsername = (name: string) => {
  if (name.length <= 4) {
    return name;
  }
  const [firstName, lastName] = name.split(" ");
  if (lastName) {
    return `${firstName.charAt(0)}... ${lastName}`;
  }
  return `${name.substring(0, 3)}...`;
};

// Function to shuffle an array
const shuffleArray = (array: string[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

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
  const { toast, dismiss } = useToast()
  const { language, currency } = useAppContext()
  const userQueue = React.useRef(shuffleArray([...withdrawalUsers]));
  const currentUserIndex = React.useRef(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);


  React.useEffect(() => {
    const showRandomToast = () => {
       if (currentUserIndex.current >= userQueue.current.length) {
          userQueue.current = shuffleArray([...withdrawalUsers]);
          currentUserIndex.current = 0;
       }
      
      const randomUser = userQueue.current[currentUserIndex.current];
      currentUserIndex.current++;

      const randomAmount = (Math.random() * (470 - 100) + 100);
      const maskedName = maskUsername(randomUser);

      toast({
        title: language.t('successfulWithdrawal'),
        description: `${maskedName} ${language.t('justWithdrew')} ${formatCurrency(randomAmount, currency)}`,
        duration: 5000,
      })
      
      // Delay for the next toast is between 4 and 8 seconds.
      const nextToastDelay = Math.random() * (8000 - 4000) + 4000;
      timeoutRef.current = setTimeout(showRandomToast, nextToastDelay);
    }
    
    // Show the first toast after an initial delay of 3 seconds.
    const initialTimeout = setTimeout(showRandomToast, 3000);

    return () => {
        clearTimeout(initialTimeout);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        dismiss(); // Dismiss any active toasts when leaving the page
    }
  }, [toast, currency, language, dismiss])


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
