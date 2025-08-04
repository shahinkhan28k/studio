
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { useUserStats } from "@/hooks/use-user-stats"
import * as React from "react"

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

const withdrawFormSchema = z
  .object({
    method: z.string({ required_error: "Please select a payment method." }),
    walletNumber: z.string().optional(),
    amount: z.coerce
      .number({ required_error: "Please enter an amount." })
      .positive({ message: "Amount must be positive." }),
    bankName: z.string().optional(),
    accountHolderName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    swiftCode: z.string().optional(),
    usdtAddress: z.string().optional(),
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
      if (!data.bankAccountNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bankAccountNumber"],
          message: "Bank account number is required.",
        })
      }
      if (!data.swiftCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["swiftCode"],
          message: "SWIFT code is required.",
        })
      }
    } else if (data.method === "usdt") {
      if (!data.usdtAddress) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["usdtAddress"],
          message: "Binance USDT address is required.",
        })
      }
    } else if (["bkash", "nagad", "rocket"].includes(data.method)) {
      if (!data.walletNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["walletNumber"],
          message: "Wallet number is required.",
        })
      }
    }
  })

type WithdrawFormValues = z.infer<typeof withdrawFormSchema>

const user = {
  name: "John Doe",
}

// This is a placeholder for the actual referral count logic
const referralCount = 5

export default function WithdrawPage() {
  const { toast } = useToast()
  const { stats, addWithdrawal } = useUserStats()
  const [availableBalance, setAvailableBalance] = React.useState(0)

  React.useEffect(() => {
    setAvailableBalance(stats.availableBalance)
  }, [stats.availableBalance])

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      amount: 0,
      method: "",
      walletNumber: "",
    },
  })
  
  const paymentMethod = form.watch("method")
  const formValues = form.watch()
  
  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem("withdrawalDetails")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        // Check if the saved method requires bank details and set them if they exist
        if (parsedData.method) {
            form.reset(parsedData)
        }
      }
    } catch (error) {
      console.error("Failed to parse withdrawal details from localStorage", error)
    }
  }, [form])
  
   React.useEffect(() => {
    try {
      localStorage.setItem("withdrawalDetails", JSON.stringify(formValues))
    } catch (error) {
      console.error("Failed to save withdrawal details to localStorage", error)
    }
  }, [formValues])


  function onSubmit(data: WithdrawFormValues) {
    if (referralCount < 20) {
      toast({
        title: "Withdrawal Requirement Not Met",
        description:
          "You must refer at least 20 people to be eligible for a withdrawal.",
        variant: "destructive",
      })
      return
    }

    if (data.amount > stats.availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You do not have enough balance to make this withdrawal.",
        variant: "destructive",
      })
      return
    }

    addWithdrawal(data.amount)

    toast({
      title: "Withdrawal Request Submitted",
      description:
        "Your request has been submitted and will be processed shortly.",
    })
    form.reset()
    localStorage.removeItem("withdrawalDetails");
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Request a Withdrawal</CardTitle>
          <CardDescription>
            Your available balance is ${availableBalance.toFixed(2)}. Enter
            your account details and the amount you wish to withdraw.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
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

              {paymentMethod === "bank" ? (
                <>
                   <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter bank name"
                            {...field}
                            value={field.value ?? ""}
                          />
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
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Account Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter bank account number"
                            {...field}
                            value={field.value ?? ""}
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
                          <Input
                            placeholder="Enter SWIFT code"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : paymentMethod === 'usdt' ? (
                <FormField
                  control={form.control}
                  name="usdtAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Binance USDT Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Binance USDT address" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : paymentMethod && (
                 <FormField
                    control={form.control}
                    name="walletNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wallet Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter wallet number" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              )}

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount to withdraw"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit Withdrawal Request</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
