import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  // Debug logging
  console.log("=== API Route Debug ===");
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
  console.log("DATABASE_URL value:", process.env.DATABASE_URL);
  console.log("NODE_ENV:", process.env.NODE_ENV);

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Build query conditions
    const where: any = {
      is_active: true,
    };

    // Add category filter if provided
    if (category && category !== "All") {
      where.category = category;
    }

    // Fetch blog posts from database
    const posts = await prisma.blog_posts.findMany({
      where,
      orderBy: {
        published_at: "desc",
      },
    });

    // Transform data to match frontend expectations
    const transformedPosts = posts.map(
      (post: {
        id: number;
        slug: string;
        category: string;
        title: string;
        summary: string;
        author: string;
        published_at: Date;
        read_time_min: number;
        is_active: boolean | null;
      }) => ({
        id: post.slug,
        slug: post.slug,
        category: post.category,
        title: post.title,
        summary: post.summary,
        author: post.author,
        publishedDate: post.published_at.toISOString().split("T")[0],
        readTimeMinutes: post.read_time_min,
        link: `/blog/${post.slug}`,
        isActive: post.is_active,
      })
    );

    return NextResponse.json({
      success: true,
      posts: transformedPosts,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog posts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
