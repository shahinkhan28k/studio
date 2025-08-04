
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

const referrals = [
  { id: "usr_001", name: "Alice", level: 1, earnings: 15.75 },
  { id: "usr_002", name: "Bob", level: 1, earnings: 5.50 },
  { id: "usr_003", name: "Charlie", level: 2, earnings: 2.25 },
  { id: "usr_004", name: "David", level: 2, earnings: 8.00 },
  { id: "usr_005", name: "Eve", level: 3, earnings: 1.20 },
]

export default function ReferPage() {
  const referralLink = "https://onearn.platform/ref/user123"
  const { language, currency } = useAppContext()

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
              <Button type="submit" size="icon" variant="outline">
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
                  <TableHead>{language.t('name')}</TableHead>
                  <TableHead>{language.t('level')}</TableHead>
                  <TableHead className="text-right">{language.t('commissionEarned')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.name}</TableCell>
                    <TableCell><Badge variant="secondary">{language.t('level')} {referral.level}</Badge></TableCell>
                    <TableCell className="text-right">{formatCurrency(referral.earnings, currency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
