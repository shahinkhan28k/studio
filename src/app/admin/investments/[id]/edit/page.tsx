
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
import { useInvestments, InvestmentPlanFormValues, InvestmentPlan } from "@/hooks/use-investments"
import { Switch } from "@/components/ui/switch"

const investmentPlanSchema = z.object({
  title: z.string().min(1, "Title is required."),
  subtitle: z.string().min(1, "Subtitle is required."),
  badge: z.string().min(1, "Badge text is required."),
  imageUrl: z.string().url("Please enter a valid image URL."),
  durationValue: z.coerce.number().int().positive("Duration must be a positive number."),
  durationUnit: z.enum(["Days", "Months", "Years"]),
  minInvestment: z.coerce.number().positive("Minimum investment must be a positive number."),
  profitRate: z.coerce.number().positive("Profit rate must be a positive number."),
  progress: z.coerce.number().min(0).max(100, "Progress must be between 0 and 100.").default(0),
  riskLevel: z.enum(["Low", "Medium", "High"]),
  tag: z.string().min(1, "Tag is required, e.g., 'Popular'"),
  maxInvestors: z.coerce.number().int().positive("Maximum investors must be a positive number.").default(100),
  totalInvestors: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  purchaseLimit: z.coerce.number().int().min(0, "Purchase limit cannot be negative.").default(1),
  luckyDrawSpins: z.coerce.number().int().min(0).default(0),
});

export default function EditInvestmentPlanPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const { updateInvestmentPlan, getInvestmentPlanById, investmentPlans } = useInvestments()
  const [plan, setPlan] = React.useState<InvestmentPlan | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  const planId = params.id as string;

  const form = useForm<InvestmentPlanFormValues>({
    resolver: zodResolver(investmentPlanSchema),
    defaultValues: {
      luckyDrawSpins: 0, // ensure default value
    }
  });

  React.useEffect(() => {
    if (planId && investmentPlans.length > 0) {
      setLoading(true);
      const planData = getInvestmentPlanById(planId);
      if (planData) {
        setPlan(planData);
        form.reset({
          ...planData,
          luckyDrawSpins: planData.luckyDrawSpins || 0, // ensure value is not undefined
        });
      }
      setLoading(false);
    }
  }, [planId, investmentPlans, getInvestmentPlanById, form]);

  async function onSubmit(data: InvestmentPlanFormValues) {
    if (!planId) return;
    updateInvestmentPlan(planId, data);
    toast({
      title: "Plan Updated",
      description: "The investment plan has been successfully updated.",
    });
    router.push("/admin/investments");
  }

  if (loading) {
      return <div className="container py-6">Loading plan...</div>;
  }
  
  if (!plan) {
      return (
          <div className="container py-6">
              <p>Plan not found.</p>
              <Button variant="link" asChild>
                  <Link href="/admin/investments">Go back</Link>
              </Button>
          </div>
      )
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Investment Plan</h1>
            <p className="text-muted-foreground">Update the details of the investment plan below.</p>
        </div>
         <Button variant="outline" asChild>
          <Link href="/admin/investments">Cancel</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Organic Agro Project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., High-yield organic farming" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="badge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge Text</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Premium" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Popular" {...field} />
                      </FormControl>
                       <FormDescription>A short tag like 'Popular' or 'New'.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <FormField
                  control={form.control}
                  name="minInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Investment (BDT)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 30000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profitRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Profit Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 150" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 items-end">
                    <FormField
                    control={form.control}
                    name="durationValue"
                    render={({ field }) => (
                        <FormItem className="flex-grow">
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 12" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="durationUnit"
                    render={({ field }) => (
                        <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="Days">Days</SelectItem>
                            <SelectItem value="Months">Months</SelectItem>
                            <SelectItem value="Years">Years</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField
                  control={form.control}
                  name="riskLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select risk level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="progress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Progress (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 10" {...field} />
                      </FormControl>
                       <FormDescription>Initial funding progress to show. Default is 0.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxInvestors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Investors</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 100" {...field} />
                      </FormControl>
                       <FormDescription>Max number of people who can invest.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalInvestors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Investors</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 25" {...field} />
                      </FormControl>
                       <FormDescription>Current number of investors (for display).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purchaseLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Limit</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1" {...field} />
                      </FormControl>
                      <FormDescription>How many times a single user can buy this plan. 0 for unlimited.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="luckyDrawSpins"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lucky Draw Spins</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1" {...field} />
                      </FormControl>
                      <FormDescription>Number of lucky draw spins awarded for this investment.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-1 md:col-span-2">
                        <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Investment</FormLabel>
                        <FormDescription>
                            Featured investments appear on the homepage.
                        </FormDescription>
                        </div>
                        <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        </FormControl>
                    </FormItem>
                    )}
                />
               </div>

              <Button type="submit">Update Plan</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
