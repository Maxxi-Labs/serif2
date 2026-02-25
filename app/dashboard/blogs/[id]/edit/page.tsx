import { notFound } from 'next/navigation'
import { getBlog } from '@/lib/actions/blogs'
import { BlogEditorFormEdit } from '@/components/blog-editor-form-client'

type EditBlogPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params
  const blog = await getBlog(id)

  if (!blog) notFound()

  return <BlogEditorFormEdit blog={blog} />
}
