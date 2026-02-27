'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

// Mirrors @tiptap/core JSONContent — defined locally to keep this server file free of client-only imports
export type JSONContent = {
  type?: string
  attrs?: Record<string, unknown>
  content?: JSONContent[]
  marks?: { type: string; attrs?: Record<string, unknown>; [key: string]: unknown }[]
  text?: string
  [key: string]: unknown
}

export type BlogStatus = 'draft' | 'published'

export type Blog = {
  id: string
  user_id: string
  title: string
  summary: string | null
  body: JSONContent | null
  image: string | null
  status: BlogStatus
  read_time: number
  slug: string
  created_at: string
  updated_at: string
}

export type BlogFormData = {
  title: string
  summary?: string
  body?: JSONContent | null
  image?: string | null
  status: BlogStatus
}

const aiBlogSchema = z.object({
  title: z.string().min(8).max(120),
  summary: z.string().min(24).max(240),
  sections: z
    .array(
      z.object({
        heading: z.string().min(3).max(120),
        paragraphs: z.array(z.string().min(20).max(1000)).min(1).max(4),
      })
    )
    .min(3)
    .max(8),
})

// Extract plain text from TipTap JSON for word count
function extractText(node: JSONContent): string {
  if (node.text) return node.text
  if (!node.content) return ''
  return node.content.map(extractText).join(' ')
}

function computeReadTime(body: JSONContent | null | undefined): number {
  if (!body) return 0
  const text = extractText(body)
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

function paragraphsToTipTapDoc(
  sections: Array<{ heading: string; paragraphs: string[] }>
): JSONContent {
  const content: JSONContent[] = []

  for (const section of sections) {
    content.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: section.heading }],
    })

    for (const paragraph of section.paragraphs) {
      content.push({
        type: 'paragraph',
        content: [{ type: 'text', text: paragraph }],
      })
    }
  }

  return {
    type: 'doc',
    content,
  }
}

function slugify(title: string, id: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
  const suffix = id.slice(0, 8)
  return `${base}-${suffix}`
}

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims?.sub) redirect('/auth/login')
  return data.claims.sub as string
}

export async function getBlogs(status?: BlogStatus): Promise<Blog[]> {
  const supabase = await createClient()
  const userId = await getAuthenticatedUserId()

  let query = supabase
    .from('blogs')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as Blog[]
}

export async function getBlog(id: string): Promise<Blog | null> {
  const supabase = await createClient()
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data as Blog
}

export async function createBlog(formData: BlogFormData): Promise<{ id: string }> {
  const supabase = await createClient()
  const userId = await getAuthenticatedUserId()

  const tempId = crypto.randomUUID()
  const slug = slugify(formData.title, tempId)
  const readTime = computeReadTime(formData.body)

  const { data, error } = await supabase
    .from('blogs')
    .insert({
      id: tempId,
      user_id: userId,
      title: formData.title,
      summary: formData.summary ?? null,
      body: formData.body ?? null,
      image: formData.image ?? null,
      status: formData.status,
      read_time: readTime,
      slug,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/blogs')
  return { id: data.id }
}

export async function createBlogWithAI(prompt: string): Promise<{ id: string }> {
  const supabase = await createClient()
  const userId = await getAuthenticatedUserId()
  const normalizedPrompt = prompt.trim()

  if (!normalizedPrompt) {
    throw new Error('Prompt is required.')
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured.')
  }

  const { object } = await generateObject({
    model: openai('gpt-5.1'),
    schema: aiBlogSchema,
    prompt: `Create a complete blog post draft from the user brief below.

User brief:
"""
${normalizedPrompt}
"""

Requirements:
- Return a practical, engaging article for a general audience.
- Include a concise title and summary.
- Include 3-8 sections.
- Each section must include a clear heading and 1-4 rich paragraphs.
- Keep tone helpful and professional.
- Avoid markdown and avoid bullet-list-only output.`,
  })

  const body = paragraphsToTipTapDoc(object.sections)
  const tempId = crypto.randomUUID()
  const slug = slugify(object.title, tempId)
  const readTime = computeReadTime(body)

  const { data, error } = await supabase
    .from('blogs')
    .insert({
      id: tempId,
      user_id: userId,
      title: object.title.trim(),
      summary: object.summary.trim(),
      body,
      image: null,
      status: 'draft',
      read_time: readTime,
      slug,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/blogs')
  return { id: data.id }
}

export async function updateBlog(id: string, formData: BlogFormData): Promise<void> {
  const supabase = await createClient()
  const userId = await getAuthenticatedUserId()

  const readTime = computeReadTime(formData.body)

  const { error } = await supabase
    .from('blogs')
    .update({
      title: formData.title,
      summary: formData.summary ?? null,
      body: formData.body ?? null,
      image: formData.image ?? null,
      status: formData.status,
      read_time: readTime,
    })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/blogs')
  revalidatePath(`/dashboard/blogs/${id}/edit`)
}

export async function deleteBlog(id: string): Promise<void> {
  const supabase = await createClient()
  const userId = await getAuthenticatedUserId()

  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/blogs')
}

export async function uploadBlogImage(file: File): Promise<string> {
  const supabase = await createClient()
  await getAuthenticatedUserId()

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from('blog-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('blog-images').getPublicUrl(path)
  return data.publicUrl
}
