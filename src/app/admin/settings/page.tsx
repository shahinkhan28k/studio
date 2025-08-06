
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
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
import { useSettings, ReferralLevel } from "@/hooks/use-settings"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, PlusCircle, Trash2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { useAdminAuth } from "@/hooks/use-admin-auth"

const referralLevelSchema = z.object({
  level: z.coerce.number(),
  requiredReferrals: z.coerce.number().min(0),
  commissionRate: z.coerce.number().min(0).max(100),
});

const settingsSchema = z.object({
  referralLevels: z.array(referralLevelSchema),
  investmentReferralCommissionRate: z.coerce.number().min(0).max(100),
  withdrawalRequirement: z.coerce.number().int().min(0),
  minimumWithdrawalAmount: z.coerce.number().min(0),
  depositSessionDuration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  agentNumbers: z.object({
    bkash: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
    nagad: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
    rocket: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  }),
  bankName: z.string(),
  bankAccountName: z.string(),
  bankAccountNumber: z.string(),
  bankBranch: z.string(),
  usdtAddress: z.string(),
  supportEmail: z.string().email(),
  supportPhoneNumber: z.string(),
  supportWhatsApp: z.string(),
})

const bannerFormSchema = z.object({
  src: z.string().url({ message: "Please enter a valid URL." }),
  alt: z.string().min(1, "Alt text is required."),
  "data-ai-hint": z.string().min(1, "AI hint is required."),
})

const adminAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters."),
})


export type BannerFormValues = z.infer<typeof bannerFormSchema>


export default function SettingsPage() {
  const { toast } = useToast()
  const { settings, setSettings } = useSettings()
  const { banners, addBanner, deleteBanner, refreshBanners } = useBanners()
  const { admin, updateAdminCredentials } = useAdminAuth()

  const settingsForm = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  })
  
  const adminAuthForm = useForm<z.infer<typeof adminAuthSchema>>({
    resolver: zodResolver(adminAuthSchema),
    defaultValues: {
      email: admin?.email || "",
      password: ""
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: settingsForm.control,
    name: "referralLevels",
  });
  
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
       const transformedDefaults = {
        ...settings,
        agentNumbers: {
            bkash: (settings.agentNumbers.bkash || []).join(', '),
            nagad: (settings.agentNumbers.nagad || []).join(', '),
            rocket: (settings.agentNumbers.rocket || []).join(', '),
        }
       }
      settingsForm.reset(transformedDefaults as any);
    }
  }, [settings, settingsForm])
  
  useEffect(() => {
    if (admin) {
        adminAuthForm.reset({
            email: admin.email,
            password: ""
        })
    }
  }, [admin, adminAuthForm]);

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

  const handleDeleteBanner = (id: string) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      deleteBanner(id)
      refreshBanners();
      toast({
        title: "Banner Deleted",
        description: "The banner has been successfully deleted.",
      })
    }
  }
  
  const onAdminAuthSubmit = (data: z.infer<typeof adminAuthSchema>) => {
    updateAdminCredentials(data.email, data.password);
    toast({
      title: "Admin Credentials Updated",
      description: "The admin login details have been updated.",
    });
    adminAuthForm.reset({ ...data, password: "" });
  };
  
  const addNewLevel = () => {
    const nextLevel = fields.length + 1;
    append({
        level: nextLevel,
        requiredReferrals: 0,
        commissionRate: 0,
    });
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
                      <Accordion type="multiple" defaultValue={["item-1-1"]} className="w-full">
                        <AccordionItem value="item-1-1">
                           <AccordionTrigger className="text-lg font-semibold">Referral Settings</AccordionTrigger>
                           <AccordionContent className="space-y-4 pt-4">
                            <FormField
                                control={settingsForm.control}
                                name="investmentReferralCommissionRate"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Investment Referral Commission Rate (%)</FormLabel>
                                    <FormControl>
                                    <Input type="number" placeholder="e.g. 5" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                    The commission percentage a user gets when their direct referral invests.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Card>
                                <CardHeader>
                                    <CardTitle>Task Referral Levels</CardTitle>
                                    <CardDescription>Define the requirements and commission for each referral level based on task earnings.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md relative">
                                            <FormField
                                                control={settingsForm.control}
                                                name={`referralLevels.${index}.level`}
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Level</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} disabled />
                                                    </FormControl>
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
                                                    <FormControl>
                                                    <Input type="number" placeholder="e.g. 3" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={settingsForm.control}
                                                name={`referralLevels.${index}.commissionRate`}
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Task Commission Rate (%)</FormLabel>
                                                    <FormControl>
                                                    <Input type="number" placeholder="e.g. 5" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6"
                                                onClick={() => remove(index)}
                                                >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-4"
                                        onClick={addNewLevel}
                                        disabled={fields.length >= 10}
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Level
                                    </Button>
                                </CardContent>
                            </Card>
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
                             <FormField
                              control={settingsForm.control}
                              name="minimumWithdrawalAmount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Minimum Withdrawal Amount</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="e.g. 10" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    The minimum amount required for a withdrawal.
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
                             <FormField
                              control={settingsForm.control}
                              name="depositSessionDuration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Deposit Session Duration (Minutes)</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="e.g. 5" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    How long a user has to complete a deposit after starting.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Card>
                              <CardHeader><CardTitle>Mobile Money</CardTitle></CardHeader>
                              <CardContent className="space-y-4">
                                <FormField
                                    control={settingsForm.control}
                                    name="agentNumbers.bkash"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>bKash Numbers</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter numbers, separated by commas" {...field} />
                                        </FormControl>
                                        <FormDescription>For number rotation, add multiple numbers separated by a comma.</FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                <FormField
                                    control={settingsForm.control}
                                    name="agentNumbers.nagad"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Nagad Numbers</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter numbers, separated by commas" {...field} />
                                        </FormControl>
                                        <FormDescription>For number rotation, add multiple numbers separated by a comma.</FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                <FormField
                                    control={settingsForm.control}
                                    name="agentNumbers.rocket"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Rocket Numbers</FormLabel>
                                        <FormControl>
                                             <Textarea placeholder="Enter numbers, separated by commas" {...field} />
                                        </FormControl>
                                        <FormDescription>For number rotation, add multiple numbers separated by a comma.</FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                              </CardContent>
                            </Card>
                          </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-1-4">
                            <AccordionTrigger className="text-lg font-semibold">Help &amp; Support Settings</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <FormField
                                control={settingsForm.control}
                                name="supportEmail"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Support Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="e.g. support@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={settingsForm.control}
                                name="supportPhoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Support Phone Number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="e.g. +1234567890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={settingsForm.control}
                                name="supportWhatsApp"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Support WhatsApp Number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="e.g. +1234567890" {...field} />
                                    </FormControl>
                                     <FormDescription>
                                        Include country code.
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      
                      <Button type="submit">Save Settings</Button>
                    </form>
                  </Form>
                </AccordionContent>
              </AccordionItem>
              
              {/* Admin Auth Settings */}
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-xl font-semibold">Admin Credentials</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <Card>
                    <CardHeader>
                        <CardTitle>Update Admin Login</CardTitle>
                        <CardDescription>Change the email and password used to log in to the admin panel.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...adminAuthForm}>
                            <form onSubmit={adminAuthForm.handleSubmit(onAdminAuthSubmit)} className="space-y-4">
                                <FormField
                                    control={adminAuthForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Admin Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={adminAuthForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Enter new password (min. 6 characters)" {...field} />
                                            </FormControl>
                                             <FormDescription>Leave blank to keep the current password.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Update Credentials</Button>
                            </form>
                        </Form>
                    </CardContent>
                  </Card>
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
