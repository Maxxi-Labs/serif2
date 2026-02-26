import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface Blog {
  id: string;
  title: string;
  summary: string | null;
  image: string | null;
  created_at: string;
  slug: string;
  read_time: number;
  profiles: {
    first_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video w-full overflow-hidden">
        {blog.image ? (
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Badge variant="secondary" className="font-normal">
            Article
          </Badge>
          <span>•</span>
          <span>{blog.read_time} min read</span>
        </div>
        <Link href={`/blog/${blog.slug}`} className="hover:underline">
          <h3 className="text-xl font-semibold line-clamp-2">{blog.title}</h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {blog.summary || "No summary available."}
        </p>
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/50 mt-auto">
        <div className="flex items-center gap-3 w-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={blog.profiles?.avatar_url || ""} />
            <AvatarFallback>
              {blog.profiles?.first_name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-xs">
            <span className="font-medium">
              {blog.profiles?.first_name || "Unknown Author"}
            </span>
            <span className="text-muted-foreground">
              {format(new Date(blog.created_at), "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
