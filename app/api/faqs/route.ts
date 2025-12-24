import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-helpers";

async function handler(request: Request) {
  // Fetch active FAQs ordered by display_order
  const faqs = await prisma.faqs.findMany({
    where: {
      is_active: true,
    },
    orderBy: [{ display_order: "asc" }, { id: "desc" }],
  });

  return apiSuccess(faqs);
}

export const GET = withErrorHandling(handler);
