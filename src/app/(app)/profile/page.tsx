import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"

const profileMenuItems = [
  { title: "Deposit", href: "/profile/deposit", icon: Icons.Deposit },
  { title: "Withdraw", href: "/profile/withdraw", icon: Icons.Withdraw },
  { title: "Account Details", href: "/profile/account", icon: Icons.Profile },
  {
    title: "Personal Information",
    href: "/profile/info",
    icon: Icons.Settings,
  },
  { title: "Help & Support", href: "/profile/help", icon: Icons.Home }, // Placeholder icon
]

export default function ProfilePage() {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://placehold.co/100x100.png",
    earnings: 1250.75,
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-lg font-normal">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${user.earnings.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {profileMenuItems.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} passHref>
                    <Button
                      variant="ghost"
                      className="w-full justify-between h-12"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span>{item.title}</span>
                      </div>
                      <Icons.ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Button variant="destructive">
          <Icons.Logout className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  )
}
