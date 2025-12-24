import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-helpers";

async function handler(request: Request) {
  // Fetch active testimonials ordered by display_order
  const testimonials = await prisma.testimonials.findMany({
    where: {
      is_active: true,
    },
    orderBy: [{ display_order: "asc" }, { id: "desc" }],
  });

  return apiSuccess(testimonials);
}

export const GET = withErrorHandling(handler);
