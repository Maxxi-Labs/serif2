'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteBlog } from '@/lib/actions/blogs'

export function DeleteBlogButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Delete this post? This action cannot be undone.')) return
    startTransition(async () => {
      try {
        await deleteBlog(id)
        toast.success('Post deleted.')
      } catch {
        toast.error('Failed to delete post.')
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-destructive h-8 w-8"
      onClick={handleDelete}
      disabled={isPending}
      title="Delete post"
    >
      <Trash2 className="size-3.5" />
    </Button>
  )
}
