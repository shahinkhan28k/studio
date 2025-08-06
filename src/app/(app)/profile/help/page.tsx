"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Mail, Phone, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useSettings } from "@/hooks/use-settings"

export default function HelpSupportPage() {
  const { settings } = useSettings()

  const faqItems = [
    {
      question: "How do I start earning?",
      answer:
        "You can start earning by navigating to the 'Tasks' page and completing any of the available tasks. Your earnings will be added to your balance immediately after completion.",
    },
    {
      question: "How do I withdraw my earnings?",
      answer:
        "You can withdraw your earnings from the 'Withdraw' section on your profile page. Please make sure you have met the minimum withdrawal amount and any other requirements.",
    },
    {
      question: "What is the referral program?",
      answer:
        "Our referral program allows you to earn commissions by inviting new users. You get a percentage of their earnings from tasks. You can find your unique referral link on the 'Refer' page.",
    },
     {
      question: "How long does it take for a deposit to be approved?",
      answer:
        "Deposits are typically processed and credited to your account balance instantly after you submit the deposit form with the correct transaction details.",
    },
  ]

  return (
    <div className="container py-6 space-y-8">
      <div>
        <Button variant="ghost" asChild className="mb-4 -ml-4">
          <Link href="/profile">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Help &amp; Support</h1>
        <p className="text-muted-foreground">
          Find answers to your questions or get in touch with our support team.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            If you can't find the answer you're looking for, please reach out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <a href={`mailto:${settings.supportEmail}`} className="block">
            <Button variant="outline" className="w-full justify-start">
              <Mail className="mr-2 h-4 w-4" />
              <span>{settings.supportEmail}</span>
            </Button>
          </a>
          <a href={`tel:${settings.supportPhoneNumber}`} className="block">
            <Button variant="outline" className="w-full justify-start">
              <Phone className="mr-2 h-4 w-4" />
              <span>{settings.supportPhoneNumber}</span>
            </Button>
          </a>
           <a href={`https://wa.me/${settings.supportWhatsApp}`} target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Contact on WhatsApp</span>
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
