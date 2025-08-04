
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/context/app-context"
import { formatCurrency } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import React from "react"
import { useUserStats } from "@/hooks/use-user-stats"

export default function ReferPage() {
  const { language, currency } = useAppContext()
  const { user } = useAuth()
  const { toast } = useToast()
  const [referralLink, setReferralLink] = React.useState("")
  const { referrals } = useUserStats();

  React.useEffect(() => {
    if (user) {
      const baseUrl = "https://onearn.platformvn.com"
      setReferralLink(`${baseUrl}/signup?ref=${user.uid}`)
    }
  }, [user])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard.",
    })
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{language.t('referAndEarnTitle')}</h1>
          <p className="text-muted-foreground">
            {language.t('referAndEarnDescription')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language.t('yourReferralLinkTitle')}</CardTitle>
            <CardDescription>
              {language.t('yourReferralLinkDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="text" value={referralLink} readOnly />
              <Button type="button" size="icon" variant="outline" onClick={copyToClipboard} disabled={!referralLink}>
                <Icons.Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language.t('commissionStructureTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg bg-background">
              <h3 className="font-bold text-lg text-primary">{language.t('level1')}</h3>
              <p className="text-muted-foreground">{language.t('level1Description')}</p>
            </div>
            <div className="p-4 border rounded-lg bg-background">
              <h3 className="font-bold text-lg text-primary">{language.t('level2')}</h3>
              <p className="text-muted-foreground">{language.t('level2Description')}</p>
            </div>
            <div className="p-4 border rounded-lg bg-background">
              <h3 className="font-bold text-lg text-primary">{language.t('level3')}</h3>
              <p className="text-muted-foreground">{language.t('level3Description')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language.t('yourReferralsTitle')}</CardTitle>
            <CardDescription>
              {language.t('yourReferralsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>{language.t('name')}</TableHead>
                  <TableHead className="text-right">{language.t('commissionEarned')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.length > 0 ? (
                  referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell className="font-medium">{referral.id}</TableCell>
                      <TableCell>{referral.name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(referral.earnings, currency)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      You haven't referred anyone yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
