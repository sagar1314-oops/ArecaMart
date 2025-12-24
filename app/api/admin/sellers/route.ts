import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Use Raw SQL to get sellers with product counts (Total, In Stock, OOS)
    // This avoids staleness issues and allows for conditional counting
    const sellersRaw: any[] = await prisma.$queryRaw`
      SELECT 
        s.id, 
        s.is_active, 
        s.subscription_end_at,
        u.name as user_name,
        u.phone as user_phone,
        u.email as user_email,
        COUNT(p.id) as total_products,
        SUM(CASE 
          WHEN p.id IS NOT NULL 
               AND p.is_active = 1 
               AND s.is_active = 1 
               AND (s.subscription_end_at IS NULL OR s.subscription_end_at >= NOW())
               AND p.stock_qty > 10 
          THEN 1 ELSE 0 END) as in_stock_products,
        SUM(CASE 
          WHEN p.id IS NOT NULL 
               AND p.is_active = 1 
               AND s.is_active = 1 
               AND (s.subscription_end_at IS NULL OR s.subscription_end_at >= NOW())
               AND p.stock_qty > 0 AND p.stock_qty <= 10 
          THEN 1 ELSE 0 END) as low_stock_products,
        SUM(CASE 
          WHEN p.id IS NOT NULL 
               AND (p.stock_qty = 0 
                OR p.is_active = 0 
                OR s.is_active = 0 
                OR (s.subscription_end_at IS NOT NULL AND s.subscription_end_at < NOW()))
          THEN 1 ELSE 0 END) as oos_products
      FROM sellers s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN products p ON p.seller_id = s.id
      WHERE u.role = 'seller'
      GROUP BY s.id, u.name, u.phone, u.email
      ORDER BY s.id DESC
    `;

    // Map back to the expected structure for the frontend
    const sellers = sellersRaw.map((s) => ({
      id: Number(s.id),
      is_active: s.is_active === 1 || s.is_active === true,
      subscription_end_at: s.subscription_end_at,
      users: {
        name: s.user_name,
        phone: s.user_phone,
        email: s.user_email,
      },
      _count: {
        products: Number(s.total_products),
        in_stock: Number(s.in_stock_products),
        low_stock: Number(s.low_stock_products),
        oos: Number(s.oos_products),
      },
    }));

    return NextResponse.json({ success: true, sellers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sellers" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { sellerId, isActive, subscriptionEndAt } = body;

    const updateData: any = {};
    if (typeof isActive === "boolean") updateData.is_active = isActive;
    if (subscriptionEndAt)
      updateData.subscription_end_at = new Date(subscriptionEndAt);

    // Seller Activation/Deactivation Logic
    // When seller is deactivated/activated, sync all their products
    const sId = Number(sellerId);

    if (isActive === false) {
      // Deactivate seller and hide all their products
      await prisma.$transaction([
        prisma.$executeRaw`UPDATE sellers SET is_active = ${false} WHERE id = ${sId}`,
        prisma.$executeRaw`UPDATE products SET is_active = ${false} WHERE seller_id = ${sId}`,
      ]);
    } else if (isActive === true) {
      // Activate seller and show all their products
      await prisma.$transaction([
        prisma.$executeRaw`UPDATE sellers SET is_active = ${true} WHERE id = ${sId}`,
        prisma.$executeRaw`UPDATE products SET is_active = ${true} WHERE seller_id = ${sId}`,
      ]);
    }

    // Handle subscription renewal
    if (subscriptionEndAt) {
      const endDate = new Date(subscriptionEndAt);
      // Renewing subscription auto-activates seller and products
      await prisma.$transaction([
        prisma.$executeRaw`UPDATE sellers SET subscription_end_at = ${endDate}, is_active = ${true} WHERE id = ${sId}`,
        prisma.$executeRaw`UPDATE products SET is_active = ${true} WHERE seller_id = ${sId}`,
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Seller update error:", error);
    return NextResponse.json(
      {
        error: "Failed to update seller",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


