'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { TipTapEditor } from '@/components/tiptap-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { createBlog, updateBlog, type Blog, type BlogStatus, type JSONContent } from '@/lib/actions/blogs'

type BlogEditorFormProps =
  | { mode: 'create' }
  | { mode: 'edit'; blog: Blog }

export function BlogEditorForm(props: BlogEditorFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = props.mode === 'edit'
  const existingBlog = isEdit ? props.blog : null

  const [title, setTitle] = useState(existingBlog?.title ?? '')
  const [summary, setSummary] = useState(existingBlog?.summary ?? '')
  const [body, setBody] = useState<JSONContent | null>(existingBlog?.body ?? null)
  const [imageUrl, setImageUrl] = useState<string | null>(existingBlog?.image ?? null)
  const [status, setStatus] = useState<BlogStatus>(existingBlog?.status ?? 'draft')

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.')
      return
    }

    setIsUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${crypto.randomUUID()}.${ext}`

      const { error } = await supabase.storage.from('blog-images').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

      if (error) throw error

      const { data } = supabase.storage.from('blog-images').getPublicUrl(path)
      setImageUrl(data.publicUrl)
    } catch (err) {
      toast.error('Image upload failed. Please try again.')
      console.error(err)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Title is required.')
      return
    }

    startTransition(async () => {
      try {
        const payload = { title: title.trim(), summary: summary.trim() || undefined, body, image: imageUrl, status }

        if (isEdit && existingBlog) {
          await updateBlog(existingBlog.id, payload)
          toast.success('Post updated.')
        } else {
          const { id } = await createBlog(payload)
          toast.success('Post created.')
          router.push(`/dashboard/blogs/${id}/edit`)
          return
        }
      } catch {
        toast.error('Something went wrong. Please try again.')
      }
    })
  }

  const isBusy = isPending || isUploading

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Content Management</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEdit ? 'Edit post' : 'New post'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/blogs')}
            disabled={isBusy}
          >
            Discard
          </Button>
          <Button type="submit" size="sm" disabled={isBusy}>
            {isBusy && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
            {status === 'published' ? 'Publish' : 'Save draft'}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Main content */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your post title"
              required
              disabled={isBusy}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="summary">Summary</Label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A short description of your post"
              rows={2}
              disabled={isBusy}
              className="placeholder:text-muted-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Body</Label>
            <div className="border-input rounded-md border">
              <TipTapEditor
                content={body}
                onChange={setBody}
                placeholder="Start writing your post…"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as BlogStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Cover image</Label>
            {imageUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                <Image
                  src={imageUrl}
                  alt="Cover image"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  disabled={isBusy}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
                  title="Remove image"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                className="border-input hover:bg-muted/50 flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed py-8 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="text-muted-foreground size-5 animate-spin" />
                ) : (
                  <ImagePlus className="text-muted-foreground size-5" />
                )}
                <span className="text-muted-foreground">
                  {isUploading ? 'Uploading…' : 'Upload cover image'}
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
