import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Overview</p>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard Home</h1>
        </div>
        <Badge>Demo Data</Badge>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Posts</CardDescription>
            <CardTitle className="text-2xl">24</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">+3 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Drafts</CardDescription>
            <CardTitle className="text-2xl">7</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">2 need review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Views</CardDescription>
            <CardTitle className="text-2xl">18.2k</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">+12% vs previous month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Subscribers</CardDescription>
            <CardTitle className="text-2xl">1,320</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">+48 this week</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Publishing cadence</CardTitle>
            <CardDescription>Placeholder chart area for weekly publishing trend.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest updates in your workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Post “How to Write Better Headlines” moved to published.</p>
            <p>Draft “My 2026 Roadmap” was updated 2 hours ago.</p>
            <p>Comment moderation queue has 5 new items.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
