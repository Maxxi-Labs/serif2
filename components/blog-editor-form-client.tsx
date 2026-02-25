'use client'

import dynamic from 'next/dynamic'
import type { Blog } from '@/lib/actions/blogs'

const BlogEditorForm = dynamic(
  () => import('@/components/blog-editor-form').then((m) => m.BlogEditorForm),
  { ssr: false }
)

export function BlogEditorFormEdit({ blog }: { blog: Blog }) {
  return <BlogEditorForm mode="edit" blog={blog} />
}
