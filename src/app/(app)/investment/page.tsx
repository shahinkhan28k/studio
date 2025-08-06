
"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useInvestments, InvestmentPlan, UserInvestment } from "@/hooks/use-investments"
import { Wallet, Info, Zap, Users, BarChart, TrendingUp, CalendarDays } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
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
import { useAppContext } from "@/context/app-context"


const InvestmentRisk = ({ level }: { level: "Low" | "Medium" | "High" }) => {
  const { language } = useAppContext();
  const levelMap = {
    Low: { dots: 1, color: "text-green-500 bg-green-500", label: language.t('lowRisk') },
    Medium: { dots: 2, color: "text-yellow-500 bg-yellow-500", label: language.t('mediumRisk') },
    High: { dots: 3, color: "text-red-500 bg-red-500", label: language.t('highRisk') },
  }
  const { dots, color, label } = levelMap[level]
  const colorClass = color.split(' ')[0]
  const bgClass = color.split(' ')[1]

  return (
    <div className={`flex items-center text-xs ${colorClass}`}>
      <div className="flex gap-1 mr-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              i < dots ? bgClass : "bg-muted"
            }`}
          ></span>
        ))}
      </div>
      {label}
    </div>
  )
}

const InvestmentCard = ({ plan, onInvest }: { plan: InvestmentPlan, onInvest: (plan: InvestmentPlan) => void }) => {
    const { language } = useAppContext();
    const getDurationText = (value: number, unit: 'Days' | 'Months' | 'Years') => {
        if (unit === 'Days') return `${value} ${language.t('days')}`;
        if (unit === 'Months') return `${value} ${language.t('months')}`;
        if (unit === 'Years') return `${value} ${language.t('years')}`;
        return `${value} ${unit}`;
    }
    const totalProfit = plan.minInvestment * (plan.profitRate / 100);
    const totalReturn = plan.minInvestment + totalProfit;
    
    const getDurationInDays = (value: number, unit: "Days" | "Months" | "Years") => {
        switch (unit) {
            case 'Days':
                return value;
            case 'Months':
                return value * 30; // Approximation
            case 'Years':
                return value * 365; // Approximation
            default:
                return value;
        }
    }
    const durationInDays = getDurationInDays(plan.durationValue, plan.durationUnit);
    const dailyIncome = durationInDays > 0 ? totalReturn / durationInDays : 0;

  return (
    <Card className="overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 flex flex-col">
      <CardHeader className="p-0 relative">
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary">{plan.badge}</Badge>
        </div>
        <div className="relative aspect-video">
          <Image
            src={plan.imageUrl}
            alt={plan.title}
            fill
            className="object-cover"
            data-ai-hint="investment business"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 p-4 text-white">
          <CardTitle className="text-xl">{plan.title}</CardTitle>
          <CardDescription className="text-white/90">
            {plan.subtitle}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="grid grid-cols-3 text-center text-sm mb-4">
          <div>
            <p className="text-muted-foreground">{language.t('duration')}</p>
            <p className="font-semibold">{getDurationText(plan.durationValue, plan.durationUnit)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{language.t('profitRate')}</p>
            <p className="font-semibold">{plan.profitRate}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">{language.t('minInvestment')}</p>
            <p className="font-semibold">{formatCurrency(plan.minInvestment, "BDT")}</p>
          </div>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-lg space-y-3 text-sm mb-4">
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center"><BarChart className="w-4 h-4 mr-2" /> {language.t('totalProfit')}</span>
                <span className="font-bold text-primary">{formatCurrency(totalProfit, "BDT")}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center"><TrendingUp className="w-4 h-4 mr-2" /> {language.t('totalReturn')}</span>
                <span className="font-bold text-green-600">{formatCurrency(totalReturn, "BDT")}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center"><CalendarDays className="w-4 h-4 mr-2" /> {language.t('dailyIncome')}</span>
                <span className="font-bold text-secondary-foreground">{formatCurrency(dailyIncome, "BDT")}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center"><Users className="w-4 h-4 mr-2" /> {language.t('investors')}</span>
                <span className="font-semibold">{plan.totalInvestors} / {plan.maxInvestors}</span>
            </div>
        </div>

        <div className="flex-grow" />

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{language.t('progress')}</span>
              <span>{plan.progress}%</span>
            </div>
            <Progress value={plan.progress} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between">
            <InvestmentRisk level={plan.riskLevel} />
            <Badge variant="outline" className="text-primary border-primary">
                  <Zap className="w-3 h-3 mr-1" />
                  {plan.tag}
              </Badge>
          </div>


          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="w-full">
              <Info className="w-4 h-4 mr-2" /> {language.t('details')}
            </Button>
            <Button className="w-full bg-accent hover:bg-accent/90" onClick={() => onInvest(plan)}>
              <Wallet className="w-4 h-4 mr-2" /> {language.t('investNow')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function InvestmentPage() {
  const { investmentPlans, investInPlan } = useInvestments()
  const { toast } = useToast()
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)
  const [selectedPlan, setSelectedPlan] = React.useState<InvestmentPlan | null>(null)
  const { language } = useAppContext()

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
       <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">{language.t('investmentPlansTitle')}</h1>
            <p className="text-muted-foreground mt-2">
                {language.t('investmentPlansDescription')}
            </p>
        </div>

      {investmentPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investmentPlans.map((plan) => (
            <InvestmentCard key={plan.id} plan={plan} onInvest={handleInvestClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{language.t('noInvestmentPlansFound')}</p>
        </div>
      )}
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
