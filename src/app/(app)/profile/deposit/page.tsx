
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import * as React from "react"
import { format } from "date-fns"
import Link from "next/link"
import { ChevronLeft, Copy, Clock } from "lucide-react"

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
import { DepositRecord, useUserStats } from "@/hooks/use-user-stats"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/context/app-context"
import { formatCurrency } from "@/lib/utils"
import { useSettings } from "@/hooks/use-settings"
import { useDeposit, DepositSession } from "@/hooks/use-deposit"

const depositRequestSchema = z.object({
    method: z.string({ required_error: "Please select a deposit method." }),
    amount: z.coerce
      .number({ required_error: "Please enter an amount." })
      .positive({ message: "Amount must be positive." }),
})

const depositSubmitSchema = z.object({
    transactionId: z.string().min(1, { message: "Transaction ID is required." }),
});

type DepositRequestValues = z.infer<typeof depositRequestSchema>
type DepositSubmitValues = z.infer<typeof depositSubmitSchema>

export default function DepositPage() {
  const { toast } = useToast()
  const { depositHistory } = useUserStats()
  const { currency } = useAppContext();
  const { settings } = useSettings();
  const { 
    session, 
    startDepositSession, 
    submitDeposit: completeDeposit,
    clearDepositSession 
  } = useDeposit();
  
  const [countdown, setCountdown] = React.useState<string>("00:00");

  const requestForm = useForm<DepositRequestValues>({
    resolver: zodResolver(depositRequestSchema),
    defaultValues: {
      amount: 0,
      method: "bkash",
    },
  });

  const submitForm = useForm<DepositSubmitValues>({
      resolver: zodResolver(depositSubmitSchema),
      defaultValues: {
          transactionId: ""
      }
  });
  
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (session) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(session.expiresAt).getTime();
        const distance = expiry - now;

        if (distance < 0) {
          clearInterval(timer);
          setCountdown("00:00");
          toast({
            title: "Session Expired",
            description: "Your deposit session has expired. Please try again.",
            variant: "destructive"
          });
          clearDepositSession();
          return;
        }

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [session, toast, clearDepositSession]);


  async function handleRequestDeposit(data: DepositRequestValues) {
    startDepositSession(data.amount, data.method);
  }

  async function handleSubmitDeposit(data: DepositSubmitValues) {
    if(!session) return;
    try {
        completeDeposit(data.transactionId);
        toast({
          title: "Deposit Submitted",
          description: "Your deposit has been submitted and will be processed shortly.",
        });
        submitForm.reset();
    } catch(e) {
        const error = e as Error;
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
    }
  }

  const copyToClipboard = (textToCopy: string) => {
    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy)
        toast({
          title: "Copied to clipboard!",
        })
    }
  }
  
  const getAgentNumber = (method: string) => {
    if (!method || !settings.agentNumbers) return '';
    const numbers = settings.agentNumbers[method as keyof typeof settings.agentNumbers];
    if (!numbers || numbers.length === 0) return '';
    // This is a simple rotation logic, can be improved.
    return numbers[Math.floor(Date.now() / (settings.depositSessionDuration * 60 * 1000)) % numbers.length];
  }
  
  const selectedMethodForDisplay = session ? session.method : requestForm.watch('method');
  const agentNumber = getAgentNumber(selectedMethodForDisplay);
  
  const renderDepositState = () => {
      if (session) {
          return (
            <>
                <Alert className="mb-6 border-primary">
                    <Clock className="h-4 w-4" />
                    <AlertTitle className="font-bold text-lg">Session Active: {countdown}</AlertTitle>
                    <AlertDescription>
                        Please send exactly <span className="font-bold text-primary">{formatCurrency(session.amount, currency)}</span> to the number below within the time limit.
                    </AlertDescription>
                </Alert>

                <div className="mb-8 space-y-4">
                  <p className="text-muted-foreground">
                    Please send the desired amount to the following {session.method} number before filling out the form below.
                  </p>
                  <div className="mt-2 space-y-2 rounded-md bg-muted p-4 text-center">
                      <div className="text-sm text-muted-foreground uppercase tracking-wider">{session.method} Personal Number [Send Money]</div>
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-2xl font-bold text-primary tracking-widest">
                        {agentNumber}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(agentNumber)}>
                            <Copy className="h-5 w-5" />
                        </Button>
                      </div>
                  </div>
                </div>

                <Form {...submitForm}>
                    <form onSubmit={submitForm.handleSubmit(handleSubmitDeposit)} className="space-y-6">
                        <FormField
                        control={submitForm.control}
                        name="transactionId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transaction ID (TrxID)</FormLabel>
                                <FormControl>
                                <Input placeholder="Enter the TrxID from your payment message" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex gap-4">
                            <Button type="submit" className="w-full">Submit Deposit</Button>
                            <Button variant="outline" className="w-full" onClick={clearDepositSession}>Cancel</Button>
                        </div>
                    </form>
                </Form>
            </>
          )
      }

      return (
        <Form {...requestForm}>
            <form onSubmit={requestForm.handleSubmit(handleRequestDeposit)} className="space-y-8">
              <FormField
                control={requestForm.control}
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={requestForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ({currency})</FormLabel>
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
              <Button type="submit" className="w-full">Start Deposit</Button>
            </form>
          </Form>
      )
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
            {session ? 'Complete your payment session.' : 'Start a new deposit session.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
            {renderDepositState()}
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
                            <TableCell>{format(new Date(deposit.date), "PP")}</TableCell>
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

    