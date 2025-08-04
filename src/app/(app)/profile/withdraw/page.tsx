
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

const withdrawFormSchema = z.object({
  method: z.string({ required_error: "Please select a payment method." }),
  walletNumber: z.string().min(1, "Wallet number is required."),
  amount: z.coerce
    .number({ required_error: "Please enter an amount." })
    .positive({ message: "Amount must be positive." }),
})

type WithdrawFormValues = z.infer<typeof withdrawFormSchema>

const user = {
    name: "John Doe",
}

// This is a placeholder for the actual referral count logic
const referralCount = 5;


export default function WithdrawPage() {
  const { toast } = useToast()
  const { stats, addWithdrawal } = useUserStats();
  const [availableBalance, setAvailableBalance] = React.useState(0);

  React.useEffect(() => {
    setAvailableBalance(stats.availableBalance);
  }, [stats.availableBalance]);


  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
        amount: 0,
        method: "",
        walletNumber: ""
    }
  })

  function onSubmit(data: WithdrawFormValues) {
    if (referralCount < 20) {
      toast({
        title: "Withdrawal Requirement Not Met",
        description: "You must refer at least 20 people to be eligible for a withdrawal.",
        variant: "destructive"
      })
      return;
    }

    if(data.amount > stats.availableBalance) {
        toast({
            title: "Insufficient Balance",
            description: "You do not have enough balance to make this withdrawal.",
            variant: "destructive"
        })
        return;
    }
    
    addWithdrawal(data.amount);

    toast({
      title: "Withdrawal Request Submitted",
      description: (
        "Your request has been submitted and will be processed shortly."
      ),
    })
    form.reset();
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Request a Withdrawal</CardTitle>
          <CardDescription>
             Your available balance is ${availableBalance.toFixed(2)}. Enter your account details and the amount you wish to withdraw.
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                    <Input readOnly value={user.name} />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormField
                control={form.control}
                name="walletNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter wallet number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter amount to withdraw" {...field} />
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
