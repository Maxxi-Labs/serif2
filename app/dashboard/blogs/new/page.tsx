'use client'

import dynamic from 'next/dynamic'

const BlogEditorForm = dynamic(
  () => import('@/components/blog-editor-form').then((m) => m.BlogEditorForm),
  { ssr: false }
)

export default function NewBlogPage() {
  return <BlogEditorForm mode="create" />
}
