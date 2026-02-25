import Link from 'next/link'
import { Plus, Clock, Pencil } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DeleteBlogButton } from '@/components/delete-blog-button'
import { getBlogs, type Blog } from '@/lib/actions/blogs'

function EmptyState({ label }: { label: string }) {
  return (
    <p className="text-muted-foreground py-8 text-center text-sm">{label}</p>
  )
}

function BlogRow({ blog }: { blog: Blog }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{blog.title}</p>
        {blog.summary && (
          <p className="text-muted-foreground mt-0.5 truncate text-xs">{blog.summary}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Badge variant="outline" className="gap-1 text-xs">
          <Clock className="size-3" />
          {blog.read_time} min
        </Badge>
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Edit post">
          <Link href={`/dashboard/blogs/${blog.id}/edit`}>
            <Pencil className="size-3.5" />
          </Link>
        </Button>
        <DeleteBlogButton id={blog.id} />
      </div>
    </div>
  )
}

export default async function DashboardBlogsPage() {
  const [published, drafts] = await Promise.all([
    getBlogs('published'),
    getBlogs('draft'),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Content Management</p>
          <h1 className="text-2xl font-semibold tracking-tight">Blogs</h1>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/blogs/new">
            <Plus className="size-4" />
            New post
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="published" className="space-y-4">
        <TabsList>
          <TabsTrigger value="published">
            Published
            {published.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-xs">
                {published.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts
            {drafts.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-xs">
                {drafts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Published posts</CardTitle>
              <CardDescription>Posts currently live on your blog.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {published.length === 0 ? (
                <EmptyState label="No published posts yet. Publish your first post to see it here." />
              ) : (
                published.map((blog) => <BlogRow key={blog.id} blog={blog} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Draft queue</CardTitle>
              <CardDescription>Work in progress posts ready for your next edit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {drafts.length === 0 ? (
                <EmptyState label="No drafts yet. Create a new post to get started." />
              ) : (
                drafts.map((blog) => <BlogRow key={blog.id} blog={blog} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
