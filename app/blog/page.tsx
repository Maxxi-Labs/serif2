import { createClient } from "@/lib/supabase/server";
import { Blog, BlogCard } from "@/components/blog-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Blog",
  description: "Read our latest articles and insights.",
};

export default async function BlogsPage() {
  const supabase = await createClient();

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select(`
      *,
      profiles (
        first_name,
        avatar_url
      )
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching blogs:", error);
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="text-muted-foreground">Unable to load blog posts. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Our Latest Insights</h1>
        <p className="text-xl text-muted-foreground">
          Explore our collection of articles, tutorials, and updates.
        </p>
      </div>

      {blogs && blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog: any) => (
            <BlogCard key={blog.id} blog={blog as Blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">No posts found</h2>
          <p className="text-muted-foreground">Check back soon for new content!</p>
        </div>
      )}
    </div>
  );
}
