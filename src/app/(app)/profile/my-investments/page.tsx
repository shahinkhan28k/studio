
"use client"

import React from "react"
import Link from "next/link"
import { ChevronLeft, Calendar, TrendingUp, Sun, CircleCheck, CircleX } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useInvestments, UserInvestment, InvestmentPlan } from "@/hooks/use-investments"
import { formatCurrency } from "@/lib/utils"
import { format, differenceInDays, parseISO } from "date-fns"
import { useAppContext } from "@/context/app-context"

const InvestmentHistoryCard = ({ investment, plan }: { investment: UserInvestment; plan: InvestmentPlan | undefined }) => {
  if (!plan) return null

  const startDate = parseISO(investment.investmentDate)
  const endDate = parseISO(investment.endDate)
  const totalDuration = differenceInDays(endDate, startDate)
  const daysPassed = differenceInDays(new Date(), startDate)
  const daysRemaining = Math.max(0, differenceInDays(endDate, new Date()))
  const progress = totalDuration > 0 ? Math.min(100, (daysPassed / totalDuration) * 100) : 100;
  const isExpired = new Date() > endDate;
  const totalReturn = investment.initialInvestment + (investment.initialInvestment * (plan.profitRate / 100));

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle>{plan.title}</CardTitle>
                <CardDescription>{plan.subtitle}</CardDescription>
            </div>
            <Badge variant={isExpired ? "secondary" : "default"}>
                {isExpired ? (
                    <>
                        <CircleX className="w-3 h-3 mr-1" />
                        মেয়াদোত্তীর্ণ
                    </>
                ) : (
                    <>
                        <CircleCheck className="w-3 h-3 mr-1" />
                        সক্রিয়
                    </>
                )}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                <span>বিনিয়োগের তারিখ:</span>
                <span className="font-semibold ml-auto text-foreground">{format(startDate, "PP")}</span>
            </div>
             <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                <span>মেয়াদ শেষের তারিখ:</span>
                <span className="font-semibold ml-auto text-foreground">{format(endDate, "PP")}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
                <Sun className="w-4 h-4 mr-2" />
                <span>দৈনিক আয়:</span>
                <span className="font-semibold ml-auto text-green-600">{formatCurrency(investment.dailyIncome, "BDT")}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>মোট রিটার্ন:</span>
                <span className="font-semibold ml-auto text-primary">{formatCurrency(totalReturn, "BDT")}</span>
            </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>অগ্রগতি</span>
            <span>{daysRemaining} দিন বাকি</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function MyInvestmentsPage() {
  const { userInvestments, getInvestmentPlanById } = useInvestments()
  const { language } = useAppContext();

  return (
    <div className="container py-6 space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-4 -ml-4">
          <Link href="/profile">
            <ChevronLeft className="mr-2 h-4 w-4" />
            প্রোফাইলে ফিরে যান
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{language.t('myInvestments')}</h1>
        <p className="text-muted-foreground">
            আপনার সকল সক্রিয় এবং পূর্ববর্তী বিনিয়োগের তালিকা দেখুন।
        </p>
      </div>

      {userInvestments.length > 0 ? (
        <div className="space-y-4">
          {userInvestments.map((investment) => {
            const plan = getInvestmentPlanById(investment.planId)
            return <InvestmentHistoryCard key={investment.planId + investment.investmentDate} investment={investment} plan={plan} />
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">আপনি এখনও কোনো প্রকল্পে বিনিয়োগ করেননি।</p>
          <Button asChild className="mt-4">
              <Link href="/investment">বিনিয়োগ করুন</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
