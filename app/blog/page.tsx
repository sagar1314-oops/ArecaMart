"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { useSearch } from "@/contexts/SearchContext";
import { HighlightText } from "@/components/HighlightText";

import { blogData, BlogPost } from "@/lib/blog-data";

export default function BlogPage() {
  const { searchQuery } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ["All", "Cultivation", "Market News", "Disease Control"];

  // Fetch blog posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/blog");

        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }

        const data = await response.json();

        if (data.success) {
          setPosts(data.posts);
        } else {
          throw new Error(data.error || "Failed to fetch blog posts");
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = searchQuery
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container px-4 py-8 md:px-6 flex-1">
        <PageHero
          title={blogData.title}
          description={blogData.subtitle}
          imageSrc="/products/organic-fertilizer.png"
          imageAlt="ArecaMart Blog"
          backgroundPosition="center"
        />

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-800 dark:text-red-300 font-medium mb-2">
              Error loading blog posts
            </p>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        ) : (
          <>
            {searchQuery && (
              <div className="mb-4 text-sm text-muted-foreground">
                {filteredPosts.length} result
                {filteredPosts.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-100">
                        <HighlightText
                          text={post.category}
                          highlight={searchQuery}
                        />
                      </span>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm text-muted-foreground">
                          {post.publishedDate}
                        </span>
                        <span className="text-xs text-muted-foreground/70">
                          ⏱️ {post.readTimeMinutes} min read
                        </span>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold mb-3 hover:text-green-600 transition-colors">
                      <Link href={post.link}>
                        <HighlightText
                          text={post.title}
                          highlight={searchQuery}
                        />
                      </Link>
                    </h2>
                    <p className="text-muted-foreground mb-4 flex-grow">
                      <HighlightText
                        text={post.summary}
                        highlight={searchQuery}
                      />
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t">
                      <span className="text-sm font-medium">
                        By {post.author}
                      </span>
                      <Link href={post.link}>
                        <Button
                          variant="link"
                          className="text-green-600 p-0 h-auto"
                        >
                          Read More →
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    No blog posts found matching &quot;{searchQuery}&quot;
                    {selectedCategory !== "All" && ` in ${selectedCategory}`}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
