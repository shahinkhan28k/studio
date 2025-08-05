
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import * as React from "react"
import { format } from "date-fns"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Copy } from "lucide-react"
import { DepositRecord, useUserStats } from "@/hooks/use-user-stats"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/context/app-context"
import { formatCurrency } from "@/lib/utils"
import { useSettings } from "@/hooks/use-settings"

const depositFormSchema = z
  .object({
    method: z.string({ required_error: "Please select a deposit method." }),
    amount: z.coerce
      .number({ required_error: "Please enter an amount." })
      .positive({ message: "Amount must be positive." }),
    transactionId: z
      .string()
      .min(1, { message: "Transaction ID is required." }),
    bankName: z.string().optional(),
    accountHolderName: z.string().optional(),
    accountNumber: z.string().optional(),
    swiftCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.method === "bank") {
      if (!data.bankName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bankName"],
          message: "Bank name is required.",
        })
      }
      if (!data.accountHolderName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["accountHolderName"],
          message: "Account holder name is required.",
        })
      }
      if (!data.accountNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["accountNumber"],
          message: "Account number is required.",
        })
      }
      if (!data.swiftCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["swiftCode"],
          message: "SWIFT code is required.",
        })
      }
    }
  })

type DepositFormValues = z.infer<typeof depositFormSchema>

export default function DepositPage() {
  const { toast } = useToast()
  const { addDeposit, depositHistory, loading } = useUserStats()
  const { currency } = useAppContext();
  const { settings, loading: settingsLoading } = useSettings();


  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: 0,
      transactionId: "",
      method: "",
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
      swiftCode: "",
    },
  })

  const selectedMethod = form.watch("method")

  async function onSubmit(data: DepositFormValues) {
    const depositData: Omit<DepositRecord, 'date' | 'id'> = {
      amount: data.amount,
      method: data.method,
      status: 'pending'
    }
    await addDeposit(depositData);
    toast({
      title: "Deposit Submitted",
      description: "Your deposit has been submitted and will be processed shortly.",
    })
    form.reset();
  }

  const copyToClipboard = (textToCopy: string) => {
    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy)
        toast({
          title: "Copied to clipboard!",
        })
    }
  }

  const isBankTransfer = selectedMethod === "bank"
  const isUsdtTransfer = selectedMethod === "usdt"
  
  if (loading || settingsLoading) {
    return <div className="container py-6">Loading...</div>
  }

  return (
    <div className="container py-6 space-y-8">
      <Button variant="ghost" asChild className="mb-4 -ml-4">
        <Link href="/profile">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Make a Deposit</CardTitle>
          <CardDescription>
            Choose your deposit method and enter the details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-8">
            <AlertTitle className="font-bold">Send Money First</AlertTitle>
            <AlertDescription>
              <p className="text-muted-foreground">
                Please send the desired amount to the following {isBankTransfer ? 'bank account' : isUsdtTransfer ? 'USDT address' : 'number'}
                before filling out this form.
              </p>
              {selectedMethod === "bank" ? (
                <div className="mt-2 space-y-2 rounded-md bg-muted p-3">
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">Bank Name:</span>
                     <span className="font-semibold text-primary">{settings.bankName}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">Account Name:</span>
                     <span className="font-semibold text-primary">{settings.bankAccountName}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">Account Number:</span>
                     <span className="font-semibold text-primary">{settings.bankAccountNumber}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">Branch:</span>
                     <span className="font-semibold text-primary">{settings.bankBranch}</span>
                   </div>
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(settings.bankAccountNumber)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                </div>
              ) : selectedMethod === 'usdt' ? (
                 <div className="mt-2 flex flex-col space-y-2 rounded-md bg-muted p-3">
                  <span className="text-sm text-muted-foreground">USDT Address (BEP20):</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary break-all">
                      {settings.usdtAddress}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(settings.usdtAddress)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : selectedMethod && selectedMethod !== "bank" ? (
                <div className="mt-2 space-y-2 rounded-md bg-muted p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Personal Number [Send Money]:</span>
                    <span className="text-lg font-semibold text-primary">
                      {settings.agentNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(settings.agentNumber)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : null }
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposit Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bkash">bKash</SelectItem>
                        <SelectItem value="nagad">Nagad</SelectItem>
                        <SelectItem value="rocket">Rocket</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="usdt">Binance (USDT)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedMethod === "bank" && (
                <>
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bank name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountHolderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter account holder name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter account number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="swiftCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SWIFT Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter SWIFT code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter transaction ID" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter the transaction ID from your payment.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit Deposit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Deposit History</CardTitle>
            <CardDescription>
                Here is a list of your recent deposits.
            </CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                   {depositHistory.length > 0 ? (
                     depositHistory.map((deposit) => (
                        <TableRow key={deposit.id}>
                            <TableCell>{format(deposit.date.toDate(), "PP")}</TableCell>
                            <TableCell>{formatCurrency(deposit.amount, currency)}</TableCell>
                            <TableCell className="capitalize">{deposit.method}</TableCell>
                            <TableCell>
                                <Badge variant={deposit.status === 'completed' ? 'default' : 'secondary'}>
                                    {deposit.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                   ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">No deposit history found.</TableCell>
                    </TableRow>
                   )}
                </TableBody>
             </Table>
        </CardContent>
      </Card>
    </div>
  )
}
