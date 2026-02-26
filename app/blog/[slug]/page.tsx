import { createClient } from "@/lib/supabase/server";
import { JSONContent } from "@/lib/actions/blogs";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TipTapEditor } from "@/components/tiptap-editor";
import { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: blog } = await supabase
    .from("blogs")
    .select("title, summary")
    .eq("slug", slug)
    .single();

  if (!blog) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.summary,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: blog, error } = await supabase
    .from("blogs")
    .select(`
      *,
      profiles (
        first_name,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !blog) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
          <Badge variant="secondary" className="font-normal">
            Article
          </Badge>
          <span>•</span>
          <span>{blog.read_time} min read</span>
          <span>•</span>
          <span>{format(new Date(blog.created_at), "MMM d, yyyy")}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center justify-center gap-3 mb-8">
          <Avatar className="h-10 w-10">
            <AvatarImage src={blog.profiles?.avatar_url || ""} />
            <AvatarFallback>
              {blog.profiles?.first_name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="font-medium text-sm">
              {blog.profiles?.first_name || "Unknown Author"}
            </p>
          </div>
        </div>
      </div>

      {blog.image && (
        <div className="relative aspect-video w-full mb-12 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

import { JSONContent } from "@/lib/actions/blogs";

// ...

      <div className="prose prose-lg dark:prose-invert mx-auto">
        <TipTapEditor content={blog.body as JSONContent} editable={false} />
      </div>
    </article>
  );
}
