
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { useUserStats, WithdrawalRecord } from "@/hooks/use-user-stats"
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
import { useAppContext } from "@/context/app-context"
import { formatCurrency } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useSettings } from "@/hooks/use-settings"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"

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

export default function WithdrawPage() {
  const { toast } = useToast()
  const { user } = useAuth();
  const { stats, addWithdrawal, withdrawalHistory, referrals, loading } = useUserStats()
  const { language, currency } = useAppContext()
  const { settings, loading: settingsLoading } = useSettings();
  const [isFetching, setIsFetching] = React.useState(true);


  const defaultValues = React.useMemo(() => ({
    amount: 0,
    method: "",
    walletNumber: "",
    bankName: "",
    accountHolderName: "",
    bankAccountNumber: "",
    swiftCode: "",
    usdtAddress: "",
  }), []);

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: defaultValues,
  })
  
  const paymentMethod = form.watch("method")
  
  React.useEffect(() => {
    const fetchWithdrawalDetails = async () => {
      if (user) {
        setIsFetching(true);
        const docRef = doc(db, "accountDetails", user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            form.reset({ ...defaultValues, ...data });
          }
        } catch (error) {
           console.error("Error fetching account details for withdrawal:", error);
        } finally {
            setIsFetching(false);
        }
      }
    };
    if (user) {
        fetchWithdrawalDetails();
    }
  }, [user, form, defaultValues]);
  

  async function onSubmit(data: WithdrawFormValues) {
    if (referrals.length < settings.withdrawalRequirement) {
      toast({
        title: "Withdrawal Requirement Not Met",
        description:
          `You must refer at least ${settings.withdrawalRequirement} people to be eligible for a withdrawal.`,
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

    const withdrawalData: Omit<WithdrawalRecord, 'date' | 'id'> = {
      amount: data.amount,
      method: data.method,
      status: 'pending'
    }

    try {
        await addWithdrawal(withdrawalData);
        toast({
            title: "Withdrawal Request Submitted",
            description: "Your request has been submitted and will be processed shortly.",
        });
        form.reset();
    } catch (error) {
         toast({
            title: "Withdrawal Failed",
            description: "Could not submit your request. Please try again.",
            variant: "destructive"
        })
    }
  }

  if (loading || settingsLoading || isFetching) {
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
          <CardTitle>Request a Withdrawal</CardTitle>
          <CardDescription>
            Your available balance is {formatCurrency(stats.availableBalance, currency)}. Enter
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
                      value={field.value}
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
              ) : paymentMethod ? (
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
              ) : null}

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
      
      <Card>
        <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>
                Here is a list of your recent withdrawals.
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
                   {withdrawalHistory.length > 0 ? (
                    withdrawalHistory.map((withdrawal) => (
                        <TableRow key={withdrawal.id}>
                            <TableCell>{format(withdrawal.date.toDate(), "PP")}</TableCell>
                            <TableCell>{formatCurrency(withdrawal.amount, currency)}</TableCell>
                            <TableCell className="capitalize">{withdrawal.method}</TableCell>
                            <TableCell>
                                <Badge variant={withdrawal.status === 'completed' ? 'default' : 'secondary'}>
                                    {withdrawal.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                   ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">No withdrawal history found.</TableCell>
                    </TableRow>
                   )}
                </TableBody>
             </Table>
        </CardContent>
      </Card>
    </div>
  )
}
