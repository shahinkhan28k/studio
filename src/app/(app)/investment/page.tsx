
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
  const levelMap = {
    Low: { dots: 1, color: "text-green-500 bg-green-500", label: "নিম্ন ঝুঁকি" },
    Medium: { dots: 2, color: "text-yellow-500 bg-yellow-500", label: "মধ্যম ঝুঁকি" },
    High: { dots: 3, color: "text-red-500 bg-red-500", label: "উচ্চ ঝুঁকি" },
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
    const getDurationText = (value: number, unit: 'Days' | 'Months' | 'Years') => {
        if (unit === 'Days') return `${value} দিন`;
        if (unit === 'Months') return `${value} মাস`;
        if (unit === 'Years') return `${value} বছর`;
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
            <p className="text-muted-foreground">সময়কাল</p>
            <p className="font-semibold">{getDurationText(plan.durationValue, plan.durationUnit)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">লাভের হার</p>
            <p className="font-semibold">{plan.profitRate}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">ন্যূনতম বিনিয়োগ</p>
            <p className="font-semibold">{formatCurrency(plan.minInvestment, "BDT")}</p>
          </div>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-lg space-y-3 text-sm mb-4">
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center"><BarChart className="w-4 h-4 mr-2" /> মোট লাভ</span>
                <span className="font-bold text-primary">{formatCurrency(totalProfit, "BDT")}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center"><TrendingUp className="w-4 h-4 mr-2" /> মোট রিটার্ন</span>
                <span className="font-bold text-green-600">{formatCurrency(totalReturn, "BDT")}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center"><CalendarDays className="w-4 h-4 mr-2" /> দৈনিক আয়</span>
                <span className="font-bold text-secondary-foreground">{formatCurrency(dailyIncome, "BDT")}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center"><Users className="w-4 h-4 mr-2" /> বিনিয়োগকারী</span>
                <span className="font-semibold">{plan.totalInvestors} / {plan.maxInvestors}</span>
            </div>
        </div>

        <div className="flex-grow" />

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>অগ্রগতি</span>
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
              <Info className="w-4 h-4 mr-2" /> বিস্তারিত
            </Button>
            <Button className="w-full bg-accent hover:bg-accent/90" onClick={() => onInvest(plan)}>
              <Wallet className="w-4 h-4 mr-2" /> বিনিয়োগ করুন
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
          title: "বিনিয়োগ সফল হয়েছে",
          description: `আপনি সফলভাবে ${selectedPlan.title} প্রকল্পে বিনিয়োগ করেছেন।`,
        })
      } catch (error) {
        toast({
          title: "বিনিয়োগ ব্যর্থ হয়েছে",
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
            <h1 className="text-3xl font-bold tracking-tight">বিনিয়োগ পরিকল্পনা</h1>
            <p className="text-muted-foreground mt-2">
                আপনার জন্য সেরা পরিকল্পনা নির্বাচন করুন এবং আপনার সম্পদ বৃদ্ধি করুন।
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
          <p className="text-muted-foreground">কোনো বিনিয়োগ পরিকল্পনা পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
    {selectedPlan && (
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>বিনিয়োগ নিশ্চিত করুন</AlertDialogTitle>
                <AlertDialogDescription>
                    আপনি কি নিশ্চিতভাবে '{selectedPlan.title}' প্রকল্পে বিনিয়োগ করতে চান? আপনার অ্যাকাউন্ট থেকে {formatCurrency(selectedPlan.minInvestment, "BDT")} কেটে নেওয়া হবে।
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedPlan(null)}>বাতিল করুন</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmInvestment}>নিশ্চিত করুন</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )}
    </>
  )
}
