import { blogData } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Clock } from "lucide-react";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = blogData.posts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title={post.title}
        description={post.summary}
        imageSrc={"/products/organic-fertilizer.png"}
        imageAlt={post.title}
        backgroundPosition="center"
      />

      <div className="container px-4 py-8 md:px-6 max-w-4xl mx-auto">
        <Link href="/blog">
          <Button
            variant="ghost"
            className="mb-6 pl-0 hover:pl-2 transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </Link>

        <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground border-b pb-6">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {post.publishedDate}
          </div>
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            {post.author}
          </div>
          <div className="flex items-center">
            <Tag className="mr-2 h-4 w-4" />
            {post.category}
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {post.readTimeMinutes} min read
          </div>
        </div>

        <article className="prose prose-green dark:prose-invert max-w-none">
          <p>{post.summary}</p>
          <p className="italic text-muted-foreground mt-8">
            Full article content coming soon...
          </p>
        </article>
      </div>
    </div>
  );
}
