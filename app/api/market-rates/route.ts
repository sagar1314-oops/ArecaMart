import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiSuccess,
  apiError,
  getQueryParams,
  withErrorHandling,
} from "@/lib/api-helpers";

async function handler(request: Request) {
  const params = getQueryParams(request);

  // Get query parameters
  const marketName = params.get("market");
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");
  const latest = params.getBoolean("latest", false);

  // Build where clause
  const where: any = {};

  if (marketName) {
    where.market_name = marketName;
  }

  if (startDate || endDate) {
    where.price_date = {};
    if (startDate) {
      where.price_date.gte = new Date(startDate);
    }
    if (endDate) {
      where.price_date.lte = new Date(endDate);
    }
  }

  // If latest flag is set, get only the most recent rate for each market
  if (latest) {
    // Get unique market names
    const markets = await prisma.market_rates.findMany({
      where: marketName ? { market_name: marketName } : {},
      select: {
        market_name: true,
      },
      distinct: ["market_name"],
    });

    // Get latest rate for each market
    const latestRates = await Promise.all(
      markets.map(async (market) => {
        return prisma.market_rates.findFirst({
          where: {
            market_name: market.market_name,
          },
          orderBy: {
            price_date: "desc",
          },
        });
      })
    );

    return apiSuccess(latestRates.filter(Boolean));
  }

  // Fetch market rates
  const rates = await prisma.market_rates.findMany({
    where,
    orderBy: [{ price_date: "desc" }, { market_name: "asc" }],
  });

  return apiSuccess(rates);
}

export const GET = withErrorHandling(handler);
