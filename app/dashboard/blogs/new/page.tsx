import Link from 'next/link'
import { FilePenLine, Sparkles, Crown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

async function getIsProUser(): Promise<boolean> {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) return false

  const { data } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()

  return !!data
}

export default async function NewBlogPage() {
  const isPro = await getIsProUser()

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

        <Card className={!isPro ? 'opacity-80' : undefined}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4" />
              Create with AI
              {!isPro && (
                <span className="ml-auto flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Crown className="size-3" />
                  Pro
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Generate a complete draft post with GPT-5.1 from a single prompt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPro ? (
              <Button asChild className="w-full" variant="secondary">
                <Link href="/dashboard/blogs/new/ai">Generate with AI</Link>
              </Button>
            ) : (
              <Button asChild className="w-full" variant="secondary">
                <Link href="/pricing">Upgrade to Pro</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
