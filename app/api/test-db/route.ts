import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-helpers";

async function handler(request: Request) {
  try {
    // Test database connection
    await prisma.$connect();

    // Try a simple query
    const count = await prisma.users.count();

    return apiSuccess({
      message: "Database connected successfully",
      tablesAccessible: true,
      userCount: count,
    });
  } catch (error) {
    return apiError(
      "Database connection failed",
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const GET = withErrorHandling(handler);
