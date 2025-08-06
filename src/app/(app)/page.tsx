
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
import { useInvestments, InvestmentPlan } from "@/hooks/use-investments"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatCurrency } from "@/lib/utils"
import { InvestmentCard } from "@/components/investment-card"


export default function HomePage() {
  const { language } = useAppContext()
  const { notices } = useNotices()
  const { banners } = useBanners()
  const { investmentPlans, investInPlan } = useInvestments()
  const { toast } = useToast()
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)
  const [selectedPlan, setSelectedPlan] = React.useState<InvestmentPlan | null>(null)

  const featuredInvestments = React.useMemo(() => {
    return investmentPlans.filter(plan => plan.isFeatured)
  }, [investmentPlans])

  const handleInvestClick = (plan: InvestmentPlan) => {
    setSelectedPlan(plan)
    setShowConfirmDialog(true)
  }

  const handleConfirmInvestment = () => {
    if (selectedPlan) {
      try {
        investInPlan(selectedPlan)
        toast({
          title: language.t('investmentSuccessTitle'),
          description: language.t('investmentSuccessDescription').replace('{planTitle}', selectedPlan.title),
        })
      } catch (error) {
        toast({
          title: language.t('investmentFailedTitle'),
          description: (error as Error).message,
          variant: "destructive",
        })
      }
    }
    setShowConfirmDialog(false)
    setSelectedPlan(null)
  }

  return (
    <>
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

        {featuredInvestments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{language.t('featuredInvestmentsTitle')}</CardTitle>
              <CardDescription>
                {language.t('featuredInvestmentsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredInvestments.map((plan) => (
                  <InvestmentCard key={plan.id} plan={plan} onInvest={handleInvestClick} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
     {selectedPlan && (
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>{language.t('confirmInvestmentTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                    {language.t('confirmInvestmentDescription')
                        .replace('{planTitle}', selectedPlan.title)
                        .replace('{amount}', formatCurrency(selectedPlan.minInvestment, "BDT"))
                    }
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedPlan(null)}>{language.t('cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmInvestment}>{language.t('confirm')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )}
    </>
  )
}
