import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>
            This is the central hub for managing the Onearn Platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Here you can manage tasks, user accounts, and AdSense ad placements. This area is restricted to administrators only.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
