
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import * as React from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from "@/context/app-context"

const accountFormSchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Please enter a valid email address."),
    mobileNumber: z.string().optional(),
    walletNumber: z.string().min(1, "Wallet number is required."),
    address: z.string().optional(),
    paymentMethod: z.string({
      required_error: "Please select a payment method.",
    }),
    bankName: z.string().optional(),
    accountHolderName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    swiftCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "bank") {
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
    }
  })

type AccountFormValues = z.infer<typeof accountFormSchema>

const defaultUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  mobileNumber: "+8801234567890",
  walletNumber: "01234567890",
  address: "123 Main St, Dhaka, Bangladesh",
  paymentMethod: "bkash",
}

export default function AccountDetailsPage() {
  const { toast } = useToast()
  const { language } = useAppContext()
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: defaultUser,
  })

  const paymentMethod = form.watch("paymentMethod")
  const formValues = form.watch()

  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem("accountDetails")
      if (savedData) {
        form.reset(JSON.parse(savedData))
      }
    } catch (error) {
      console.error("Failed to parse account details from localStorage", error)
    }
  }, [form])

  React.useEffect(() => {
    try {
      localStorage.setItem("accountDetails", JSON.stringify(formValues))
    } catch (error) {
      console.error("Failed to save account details to localStorage", error)
    }
  }, [formValues])

  function onSubmit(data: AccountFormValues) {
    toast({
      title: "Account Updated",
      description: "Your account details have been successfully updated.",
    })
  }

  return (
    <div className="container py-6">
       <Button variant="ghost" asChild className="mb-4">
        <Link href="/profile">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{language.t('accountDetails')}</CardTitle>
          <CardDescription>
            View and update your account information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter your mobile number" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="walletNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your wallet number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Payment Method</FormLabel>
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
              {paymentMethod === "bank" && (
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
              )}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your address"
                        className="resize-none"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update Account</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
