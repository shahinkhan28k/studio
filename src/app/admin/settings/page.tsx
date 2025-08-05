
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
import { useSettings } from "@/hooks/use-settings"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useBanners } from "@/hooks/use-banners"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"

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

const bannerFormSchema = z.object({
  src: z.string().url({ message: "Please enter a valid URL." }),
  alt: z.string().min(1, "Alt text is required."),
  "data-ai-hint": z.string().min(1, "AI hint is required."),
})

export type BannerFormValues = z.infer<typeof bannerFormSchema>


export default function SettingsPage() {
  const { toast } = useToast()
  const { settings, setSettings } = useSettings()
  const { banners, addBanner, deleteBanner } = useBanners()

  const settingsForm = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  })
  
  const bannerForm = useForm<z.infer<typeof bannerFormSchema>>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      src: "",
      alt: "",
      "data-ai-hint": "",
    },
  })

  useEffect(() => {
    if (settings) {
      settingsForm.reset(settings)
    }
  }, [settings, settingsForm])

  async function onSettingsSubmit(data: z.infer<typeof settingsSchema>) {
    setSettings(data)
    toast({
      title: "Settings Saved",
      description: "Your new settings have been successfully saved.",
    })
  }
  
  async function onBannerSubmit(data: z.infer<typeof bannerFormSchema>) {
    addBanner(data)
    toast({
      title: "Banner Added",
      description: "The new banner has been successfully added.",
    })
    bannerForm.reset()
  }

  const handleDeleteBanner = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      deleteBanner(id)
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
                <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
                <p className="text-muted-foreground">Manage your website's configuration.</p>
            </div>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
            <Accordion type="multiple" defaultValue={["item-1"]} className="w-full">
              {/* Main Settings */}
              <AccordionItem value="item-1">
                 <AccordionTrigger className="text-xl font-semibold">Main Settings</AccordionTrigger>
                 <AccordionContent className="pt-4">
                  <Form {...settingsForm}>
                    <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-8">
                      <Accordion type="multiple" defaultValue={["item-1-1", "item-1-2", "item-1-3"]} className="w-full">
                        <AccordionItem value="item-1-1">
                          <AccordionTrigger className="text-lg font-semibold">Referral Settings</AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            <FormField
                              control={settingsForm.control}
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
                              control={settingsForm.control}
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
                              control={settingsForm.control}
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
                        <AccordionItem value="item-1-2">
                          <AccordionTrigger className="text-lg font-semibold">Withdrawal Settings</AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            <FormField
                              control={settingsForm.control}
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
                        <AccordionItem value="item-1-3">
                          <AccordionTrigger className="text-lg font-semibold">Deposit Settings</AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            <Card>
                              <CardHeader><CardTitle>Mobile Money</CardTitle></CardHeader>
                              <CardContent>
                                <FormField
                                    control={settingsForm.control}
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
                                    control={settingsForm.control}
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
                                    control={settingsForm.control}
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
                                    control={settingsForm.control}
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
                                    control={settingsForm.control}
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
                                    control={settingsForm.control}
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
                </AccordionContent>
              </AccordionItem>

              {/* Banner Settings */}
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-semibold">Homepage Banner Settings</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <Card>
                      <CardHeader>
                          <CardTitle>Add New Banner</CardTitle>
                          <CardDescription>Add a new promotional banner to the homepage carousel.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...bannerForm}>
                          <form onSubmit={bannerForm.handleSubmit(onBannerSubmit)} className="space-y-8">
                            <FormField
                              control={bannerForm.control}
                              name="src"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Image URL</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://placehold.co/1200x500.png" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={bannerForm.control}
                              name="alt"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Alt Text</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Promotional Banner" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={bannerForm.control}
                              name="data-ai-hint"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>AI Hint</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. digital marketing" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit">Add Banner</Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Current Banners</CardTitle>
                        <CardDescription>List of banners currently on the homepage.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <div className="border rounded-lg">
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                  <TableHead>Preview</TableHead>
                                  <TableHead>Alt Text</TableHead>
                                  <TableHead>Actions</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {banners.length > 0 ? (
                                  banners.map((banner) => (
                                      <TableRow key={banner.id}>
                                      <TableCell>
                                          <Image src={banner.src} alt={banner.alt} width={100} height={40} className="object-cover rounded-md" />
                                      </TableCell>
                                      <TableCell>{banner.alt}</TableCell>
                                      <TableCell>
                                          <Button variant="destructive" size="sm" onClick={() => handleDeleteBanner(banner.id)}>Delete</Button>
                                      </TableCell>
                                      </TableRow>
                                  ))
                                  ) : (
                                  <TableRow>
                                      <TableCell colSpan={3} className="text-center">No banners found.</TableCell>
                                  </TableRow>
                                  )}
                              </TableBody>
                          </Table>
                          </div>
                      </CardContent>
                    </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
