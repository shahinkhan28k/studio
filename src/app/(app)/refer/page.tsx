
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
import { useSettings } from "@/hooks/use-settings"
import { Copy } from "lucide-react"

export default function ReferPage() {
  const { language, currency } = useAppContext()
  const { user } = useAuth()
  const { toast } = useToast()
  const [referralLink, setReferralLink] = React.useState("")
  const { referrals } = useUserStats();
  const { settings } = useSettings();

  React.useEffect(() => {
    if (user) {
      const baseUrl = window.location.origin
      setReferralLink(`${baseUrl}/signup?ref=${user.uid}`)
    }
  }, [user])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Copied to clipboard.",
    })
  }
  
  const currentLevel = React.useMemo(() => {
    const totalReferrals = referrals.length;
    let currentLvl = 0;
    // Ensure levels are sorted by required referrals ascending
    const sortedLevels = [...settings.referralLevels].sort((a, b) => a.requiredReferrals - b.requiredReferrals);
    for (const level of sortedLevels) {
        if (totalReferrals >= level.requiredReferrals) {
            currentLvl = level.level;
        } else {
            break;
        }
    }
    return currentLvl;
  }, [referrals.length, settings.referralLevels]);

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
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-medium">Your Referral Link</label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="text" value={referralLink} readOnly />
                  <Button type="button" size="icon" variant="outline" onClick={() => copyToClipboard(referralLink)} disabled={!referralLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Your Referral ID</label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="text" value={user?.uid || ""} readOnly />
                  <Button type="button" size="icon" variant="outline" onClick={() => copyToClipboard(user?.uid || "")} disabled={!user?.uid}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language.t('commissionStructureTitle')}</CardTitle>
            <CardDescription>Your current level is <Badge variant="secondary">Level {currentLevel}</Badge></CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Required Referrals</TableHead>
                  <TableHead className="text-right">Commission Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...settings.referralLevels].sort((a, b) => a.level - b.level).map((level) => (
                    <TableRow key={level.level} className={level.level === currentLevel ? "bg-primary/10" : ""}>
                        <TableCell>
                            <Badge variant={level.level === currentLevel ? "default" : "outline"}>
                                Level {level.level}
                            </Badge>
                        </TableCell>
                        <TableCell>{level.requiredReferrals}</TableCell>
                        <TableCell className="text-right">{formatCurrency(level.commissionAmount, currency)}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
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
