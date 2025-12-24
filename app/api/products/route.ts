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
  const categoryCode = params.get("category");
  const search = params.get("search");
  const page = params.getInt("page") ?? 1;
  const limit = params.getInt("limit") ?? 50;
  const activeOnly = params.getBoolean("active", true);
  const sort = params.get("sort");
  const tag = params.get("tag");

  let products: any[] = [];
  let total: number = 0;

  // Building Raw SQL query to bypass stale Prisma Client validation
  try {
    const skipNum = Number(page - 1) * Number(limit);

    // Base WHERE conditions
    const conditions: string[] = [];

    // activeOnly filter removed to show all products as requested

    // Category filter
    if (categoryCode) {
      const cat: any[] =
        await prisma.$queryRaw`SELECT id FROM categories WHERE code = ${categoryCode}`;
      if (cat.length > 0) {
        conditions.push(`p.category_id = ${cat[0].id}`);
      }
    }

    // Search filter
    if (search) {
      const escapedSearch = search.replace(/'/g, "''");
      conditions.push(
        `(p.name LIKE '%${escapedSearch}%' OR p.description LIKE '%${escapedSearch}%')`
      );
    }

    // Product visibility filters
    // Hide products if: product inactive, seller inactive, or subscription expired
    conditions.push(`p.is_active = 1`);
    conditions.push(`(s.is_active = 1 OR s.id IS NULL)`);
    conditions.push(
      `(s.subscription_end_at IS NULL OR s.subscription_end_at >= NOW())`
    );

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const orderBySql =
      sort === "sales" ? "p.sold_count DESC" : "p.created_at DESC";

    // Get total count
    const totalRaw: any[] = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) as count 
       FROM products p 
       LEFT JOIN sellers s ON p.seller_id = s.id
       ${whereClause}`
    );
    total = Number(totalRaw[0].count);

    // Get products with all relations via Raw SQL
    const productsRaw: any[] = await prisma.$queryRawUnsafe(`
      SELECT p.*, 
             c.name as category_name,
             c.code as category_code,
             u.name as seller_name,
             s.is_active as seller_active,
             s.subscription_end_at as seller_subscription_end_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sellers s ON p.seller_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      ${whereClause}
      ORDER BY ${orderBySql}
      LIMIT ${Number(limit)} OFFSET ${skipNum}
    `);

    products = productsRaw.map((p: any) => {
      // OOS only if stock quantity is zero
      const isOOS = p.stock_qty === 0;

      return {
        ...p,
        id: Number(p.id),
        price: Number(p.price),
        rating: Number(p.rating || 0),
        review_count: Number(p.review_count || 0),
        sold_count: Number(p.sold_count || 0),
        is_active: p.is_active === 1 || p.is_active === true,
        is_out_of_stock: isOOS,
        admin_deactivated:
          p.admin_deactivated === 1 || p.admin_deactivated === true,
        categories: {
          id: p.category_id,
          name: p.category_name,
          code: p.category_code,
        },
        sellers: p.seller_id
          ? {
              id: p.seller_id,
              is_active: p.seller_active === 1 || p.seller_active === true,
              subscription_end_at: p.seller_subscription_end_at,
              users: {
                name: p.seller_name,
              },
            }
          : null,
      };
    });
  } catch (err) {
    console.error("Marketplace Raw SQL Fetch failed", err);
    return apiError("Internal server error", err, 500);
  }

  return apiSuccess({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export const GET = withErrorHandling(handler);
