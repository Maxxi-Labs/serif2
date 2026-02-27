'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { createBlogWithAI } from '@/lib/actions/blogs'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function NewAIBlogPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [prompt, setPrompt] = useState('')

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault()

    if (!prompt.trim()) {
      toast.error('Please add a prompt to generate your post.')
      return
    }

    startTransition(async () => {
      try {
        const { id } = await createBlogWithAI(prompt)
        toast.success('Draft generated and saved.')
        router.push(`/dashboard/blogs/${id}/edit`)
      } catch {
        toast.error('Unable to generate a post right now. Please try again.')
      }
    })
  }

  return (
    <form onSubmit={handleGenerate} className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Content Management</p>
          <h1 className="text-2xl font-semibold tracking-tight">Create with AI</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => router.push('/dashboard/blogs/new')}
          >
            Back
          </Button>
          <Button size="sm" type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <Sparkles className="mr-1.5 size-3.5" />
            )}
            Generate & Save draft
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-1.5">
        <Label htmlFor="prompt">Prompt</Label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Write a post about how small product teams can use AI agents to speed up customer support while keeping quality high."
          rows={8}
          disabled={isPending}
          className="placeholder:text-muted-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 resize-y"
        />
        <p className="text-muted-foreground text-xs">
          GPT-5.1 will generate title, summary, and body, then save the post directly as a draft.
        </p>
      </div>
    </form>
  )
}
