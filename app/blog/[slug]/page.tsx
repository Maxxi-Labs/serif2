import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { JSONContent } from "@/lib/actions/blogs";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TipTapEditor } from "@/components/tiptap-editor";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const supabase = createStaticClient();

  const { data: blogs } = await supabase
    .from("blogs")
    .select("slug")
    .eq("status", "published");

  return (blogs ?? []).map((blog) => ({ slug: blog.slug }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: blog } = await supabase
    .from("blogs")
    .select("title, summary, image, created_at, updated_at, profiles(first_name)")
    .eq("slug", slug)
    .single();

  if (!blog) {
    return { title: "Blog Post Not Found" };
  }

  const canonicalUrl = `${baseUrl}/blog/${slug}`;
  const authorName = (blog.profiles as { first_name?: string } | null)?.first_name;
  const ogImage = blog.image
    ? [{ url: blog.image, width: 1200, height: 630, alt: blog.title }]
    : undefined;

  return {
    title: blog.title,
    description: blog.summary ?? undefined,
    authors: authorName ? [{ name: authorName }] : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: blog.title,
      description: blog.summary ?? undefined,
      images: ogImage,
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
      authors: authorName ? [authorName] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.summary ?? undefined,
      images: blog.image ? [blog.image] : undefined,
    },
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

  const canonicalUrl = `${baseUrl}/blog/${slug}`;
  const publishDate = new Date(blog.created_at).toISOString();
  const modifiedDate = new Date(blog.updated_at).toISOString();
  const authorName = blog.profiles?.first_name || "Unknown Author";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.summary ?? undefined,
    image: blog.image ?? undefined,
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Serif 2",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to all posts
        </Link>

        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <Badge variant="secondary" className="font-normal">
              Article
            </Badge>
            <span>•</span>
            <span>{blog.read_time} min read</span>
            <span>•</span>
            <time dateTime={publishDate}>
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center justify-center gap-3 mb-8">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={blog.profiles?.avatar_url || ""}
                alt={authorName}
              />
              <AvatarFallback>
                {blog.profiles?.first_name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium text-sm">{authorName}</p>
            </div>
          </div>
        </div>

        {blog.image && (
          <div className="relative aspect-video w-full mb-12 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={blog.image}
              alt={`Cover image for ${blog.title}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert mx-auto">
          <TipTapEditor content={blog.body as JSONContent} editable={false} />
        </div>
      </article>
    </>
  );
}
