import { Plus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DashboardBlogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Content Management</p>
          <h1 className="text-2xl font-semibold tracking-tight">Blogs</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Demo Content</Badge>
          <Button size="sm">
            <Plus className="size-4" />
            New post
          </Button>
        </div>
      </div>

      <Tabs defaultValue="published" className="space-y-4">
        <TabsList>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Published posts</CardTitle>
              <CardDescription>Recent posts currently live on your blog.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <p>Designing a Better Writing Workflow</p>
                <Badge variant="outline">4.2k views</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <p>How to Build an Editorial Calendar</p>
                <Badge variant="outline">2.1k views</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <p>Finding Your Brand Voice as a Writer</p>
                <Badge variant="outline">1.7k views</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle>Draft queue</CardTitle>
              <CardDescription>Work in progress posts ready for your next edit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Draft: “The Best AI Prompts for Writers”</p>
              <p>Draft: “7 Mistakes New Bloggers Make”</p>
              <p>Draft: “Growing an Audience from 0 to 1,000”</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled posts</CardTitle>
              <CardDescription>Upcoming posts set to publish automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>“The Minimalist Content Stack” — Monday, 9:00 AM</p>
              <p>“How I Repurpose One Post into 5” — Wednesday, 1:30 PM</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
