
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useInvestments, InvestmentPlan, UserInvestment } from "@/hooks/use-investments"
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
import { InvestmentCard } from "@/components/investment-card"


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
