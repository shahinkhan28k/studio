
"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useBanners, BannerFormValues } from "@/hooks/use-banners"
import Link from "next/link"
import { ChevronLeft, PlusCircle, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { useSettings, Settings, ReferralLevel } from "@/hooks/use-settings"
import React from "react"

const bannerFormSchema = z.object({
  src: z.string().url("Please enter a valid URL."),
  alt: z.string().min(1, "Alt text is required."),
  "data-ai-hint": z.string().min(1, "AI hint is required."),
})

const settingsFormSchema = z.object({
  referralLevels: z.array(
    z.object({
      level: z.coerce.number().min(1),
      requiredReferrals: z.coerce.number().min(0, "Required referrals must be 0 or more."),
      commissionRate: z.coerce.number().min(0, "Commission rate must be 0 or more."),
    })
  ),
  investmentReferralCommissionRate: z.coerce.number().min(0),
  withdrawalRequirement: z.coerce.number().min(0),
  minimumWithdrawalAmount: z.coerce.number().min(0),
  depositSessionDuration: z.coerce.number().min(1),
  agentNumbers: z.object({
    bkash: z.string(),
    nagad: z.string(),
    rocket: z.string(),
  }),
  supportEmail: z.string().email(),
  supportPhoneNumber: z.string(),
  supportWhatsApp: z.string(),
})

export default function SettingsPage() {
  const { toast } = useToast()
  const { banners, addBanner, deleteBanner } = useBanners()
  const { settings, setSettings } = useSettings()

  const bannerForm = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      src: "",
      alt: "",
      "data-ai-hint": "",
    },
  })

  const settingsForm = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control: settingsForm.control,
    name: "referralLevels",
  })
  
  React.useEffect(() => {
    if (settings) {
        settingsForm.reset({
            ...settings,
            agentNumbers: {
                bkash: settings.agentNumbers.bkash.join(", "),
                nagad: settings.agentNumbers.nagad.join(", "),
                rocket: settings.agentNumbers.rocket.join(", "),
            },
            referralLevels: settings.referralLevels.sort((a,b) => a.level - b.level)
        });
    }
  }, [settings, settingsForm]);

  const onBannerSubmit = (data: BannerFormValues) => {
    addBanner(data)
    toast({ title: "Banner Added", description: "The new banner has been successfully added." })
    bannerForm.reset()
  }

  const onSettingsSubmit = (data: z.infer<typeof settingsFormSchema>) => {
    const newSettings: Settings = {
      ...data,
      agentNumbers: {
        bkash: data.agentNumbers.bkash.split(",").map(s => s.trim()).filter(Boolean),
        nagad: data.agentNumbers.nagad.split(",").map(s => s.trim()).filter(Boolean),
        rocket: data.agentNumbers.rocket.split(",").map(s => s.trim()).filter(Boolean),
      },
    }
    setSettings(newSettings)
    toast({ title: "Settings Updated", description: "Platform settings have been saved." })
  }

  const handleDeleteBanner = (id: string) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      deleteBanner(id)
      toast({
        title: "Banner Deleted",
        description: "The banner has been successfully deleted.",
      })
    }
  }
  
  const addNewLevel = () => {
    const newLevelNumber = fields.length + 1;
    if (newLevelNumber > 10) {
        toast({ title: "Level Limit", description: "You can only have up to 10 referral levels.", variant: "destructive" });
        return;
    }
    append({ level: newLevelNumber, requiredReferrals: 0, commissionRate: 0 });
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
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Homepage Banner Settings</CardTitle>
            <CardDescription>Manage the promotional banners on the homepage carousel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <Form {...bannerForm}>
              <form onSubmit={bannerForm.handleSubmit(onBannerSubmit)} className="space-y-4 p-4 border rounded-lg">
                <CardTitle className="text-lg">Add New Banner</CardTitle>
                <FormField
                  control={bannerForm.control}
                  name="src"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/banner.png" {...field} />
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
                        <Input placeholder="Descriptive text for the banner" {...field} />
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
                        <Input placeholder="e.g., 'advertisement promotion'" {...field} />
                      </FormControl>
                      <FormDescription>One or two keywords for AI image search.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add Banner</Button>
              </form>
            </Form>

            <Card>
              <CardHeader>
                <CardTitle>Current Banners</CardTitle>
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
          </CardContent>
        </Card>
        
        <Form {...settingsForm}>
          <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage general platform settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={settingsForm.control}
                    name="minimumWithdrawalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Withdrawal Amount</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={settingsForm.control}
                    name="withdrawalRequirement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Withdrawal Referral Requirement</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                         <FormDescription>Number of referrals required to enable withdrawals.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={settingsForm.control}
                    name="depositSessionDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deposit Session Duration (Minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={settingsForm.control}
                    name="investmentReferralCommissionRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment Referral Commission Rate (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Commission rate for when a referred user invests.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Agent Deposit Numbers</CardTitle>
                        <CardDescription>Enter numbers separated by commas.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={settingsForm.control} name="agentNumbers.bkash" render={({field}) => (
                             <FormItem><FormLabel>bKash Numbers</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={settingsForm.control} name="agentNumbers.nagad" render={({field}) => (
                             <FormItem><FormLabel>Nagad Numbers</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={settingsForm.control} name="agentNumbers.rocket" render={({field}) => (
                             <FormItem><FormLabel>Rocket Numbers</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Support Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-4">
                        <FormField control={settingsForm.control} name="supportEmail" render={({field}) => (
                             <FormItem><FormLabel>Support Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={settingsForm.control} name="supportPhoneNumber" render={({field}) => (
                             <FormItem><FormLabel>Support Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={settingsForm.control} name="supportWhatsApp" render={({field}) => (
                             <FormItem><FormLabel>Support WhatsApp Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </CardContent>
                 </Card>

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Referral Commission Levels</CardTitle>
                    <CardDescription>Set up the MLM commission structure for referrals. (Max 10 levels)</CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addNewLevel}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Level
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end p-4 border rounded-lg">
                      <FormField
                        control={settingsForm.control}
                        name={`referralLevels.${index}.level`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Level</FormLabel>
                            <FormControl><Input type="number" {...field} disabled /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={settingsForm.control}
                        name={`referralLevels.${index}.requiredReferrals`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Required Referrals</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                             <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={settingsForm.control}
                        name={`referralLevels.${index}.commissionRate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Commission Rate (%)</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                             <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button type="submit">Save All Settings</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

    