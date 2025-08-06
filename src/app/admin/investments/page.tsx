
"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useInvestments } from "@/hooks/use-investments"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function InvestmentsAdminPage() {
  const { investmentPlans, deleteInvestmentPlan } = useInvestments()

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this investment plan?")) {
      deleteInvestmentPlan(id)
    }
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                    <ChevronLeft />
                </Link>
           </Button>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Investment Plans</h1>
                <p className="text-muted-foreground">Manage investment plans for users.</p>
            </div>
        </div>
        <Button asChild>
          <Link href="/admin/investments/new">Add Plan</Link>
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Min. Investment</TableHead>
              <TableHead>Profit Rate (%)</TableHead>
              <TableHead>Duration (Months)</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investmentPlans.length > 0 ? (
              investmentPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.title}</TableCell>
                  <TableCell>{formatCurrency(plan.minInvestment, "BDT")}</TableCell>
                  <TableCell>{plan.profitRate}%</TableCell>
                  <TableCell>{plan.duration} months</TableCell>
                  <TableCell>
                    <Badge variant={plan.riskLevel === 'Low' ? 'default' : plan.riskLevel === 'Medium' ? 'secondary' : 'destructive'}>
                        {plan.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2" asChild>
                        <Link href={`/admin/investments/${plan.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(plan.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No investment plans found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
