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

const referrals = [
  { id: "usr_001", name: "Alice", level: 1, earnings: 15.75 },
  { id: "usr_002", name: "Bob", level: 1, earnings: 5.50 },
  { id: "usr_003", name: "Charlie", level: 2, earnings: 2.25 },
  { id: "usr_004", name: "David", level: 2, earnings: 8.00 },
  { id: "usr_005", name: "Eve", level: 3, earnings: 1.20 },
]

export default function ReferPage() {
  const referralLink = "https://onearn.platform/ref/user123"

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Refer & Earn</h1>
          <p className="text-muted-foreground">
            Invite your friends and earn commissions from their tasks.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>
              Share this link with your friends. You'll earn a commission every time they complete a task.
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
            <CardTitle>Commission Structure</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg bg-background">
              <h3 className="font-bold text-lg text-primary">Level 1</h3>
              <p className="text-muted-foreground">Earn 5% from your direct referrals.</p>
            </div>
            <div className="p-4 border rounded-lg bg-background">
              <h3 className="font-bold text-lg text-primary">Level 2</h3>
              <p className="text-muted-foreground">Earn 2% from their referrals.</p>
            </div>
            <div className="p-4 border rounded-lg bg-background">
              <h3 className="font-bold text-lg text-primary">Level 3</h3>
              <p className="text-muted-foreground">Earn 1% from the next level.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>
              Here's a list of members who joined using your link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Commission Earned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.name}</TableCell>
                    <TableCell><Badge variant="secondary">Level {referral.level}</Badge></TableCell>
                    <TableCell className="text-right">${referral.earnings.toFixed(2)}</TableCell>
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
