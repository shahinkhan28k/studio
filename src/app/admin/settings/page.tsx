
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useSettings, Settings } from "@/hooks/use-settings.tsx"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

const settingsSchema = z.object({
  referralCommissionRateL1: z.coerce.number().min(0).max(100),
  referralCommissionRateL2: z.coerce.number().min(0).max(100),
  referralCommissionRateL3: z.coerce.number().min(0).max(100),
  withdrawalRequirement: z.coerce.number().int().min(0),
  agentNumber: z.string(),
  bankName: z.string(),
  bankAccountName: z.string(),
  bankAccountNumber: z.string(),
  bankBranch: z.string(),
  usdtAddress: z.string(),
})

export default function SettingsPage() {
  const { toast } = useToast()
  const { settings, setSettings } = useSettings()

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  })

  useEffect(() => {
    form.reset(settings)
  }, [settings, form])

  function onSubmit(data: z.infer<typeof settingsSchema>) {
    setSettings(data)
    toast({
      title: "Settings Saved",
      description: "Your new settings have been successfully saved.",
    })
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
                <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
                <p className="text-muted-foreground">Manage your website's configuration.</p>
            </div>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]} className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold">Referral Settings</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="referralCommissionRateL1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level 1 Commission Rate (%)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 5" {...field} />
                          </FormControl>
                          <FormDescription>
                            Commission percentage for direct referrals.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="referralCommissionRateL2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level 2 Commission Rate (%)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 2" {...field} />
                          </FormControl>
                          <FormDescription>
                            Commission percentage for second-level referrals.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="referralCommissionRateL3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level 3 Commission Rate (%)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Commission percentage for third-level referrals.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold">Withdrawal Settings</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="withdrawalRequirement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Referral Requirement</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 20" {...field} />
                          </FormControl>
                          <FormDescription>
                            Number of referrals required before a user can withdraw.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold">Deposit Settings</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <Card>
                      <CardHeader><CardTitle>Mobile Money</CardTitle></CardHeader>
                      <CardContent>
                        <FormField
                            control={form.control}
                            name="agentNumber"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Personal Number [Send Money]</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter number for bKash, Nagad etc." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                      </CardContent>
                    </Card>
                     <Card>
                      <CardHeader><CardTitle>Bank Account</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                         <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Bank Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Example Bank Ltd." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                             <FormField
                            control={form.control}
                            name="bankAccountName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Account Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Onearn Platform" {...field} />
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
                                <FormLabel>Account Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 1234567890123" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                             <FormField
                            control={form.control}
                            name="bankBranch"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Branch Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Dhaka" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                      </CardContent>
                    </Card>
                     <Card>
                      <CardHeader><CardTitle>USDT (BEP-20)</CardTitle></CardHeader>
                      <CardContent>
                         <FormField
                            control={form.control}
                            name="usdtAddress"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>USDT Wallet Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter BEP-20 USDT address" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button type="submit">Save Settings</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
