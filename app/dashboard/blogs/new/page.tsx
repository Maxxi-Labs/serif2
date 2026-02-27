import Link from 'next/link'
import { FilePenLine, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewBlogPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">Content Management</p>
        <h1 className="text-2xl font-semibold tracking-tight">Create new post</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilePenLine className="size-4" />
              Create manually
            </CardTitle>
            <CardDescription>
              Write and format your post from scratch in the editor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/blogs/new/manual">Start writing</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4" />
              Create with AI
            </CardTitle>
            <CardDescription>
              Generate a complete draft post with GPT-5.1 from a single prompt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/dashboard/blogs/new/ai">Generate with AI</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
