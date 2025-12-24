import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.role as string)?.toLowerCase() !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.orders.findMany({
      include: {
        users: { select: { name: true } }, // Customer
        order_items: {
          include: {
            products: {
              include: {
                sellers: {
                  include: {
                    users: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { id: "desc" },
    });

    // Flatten for easier display?
    // Actually, orders can have items from multiple sellers?
    // If ArecaMart supports multi-seller cart (which it seems to), then an "Order" is global.
    // The requirement "group orders by seller" implies splitting distinct seller-portions or showing "Order X contains items from Seller A and B".
    // For simplicity, I'll return the full structure and let the Frontend group or display per item.
    // However, usually marketplaces split orders per seller (Sub-orders). Database has `order_items`.
    // I'll return the rich structure.

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Admin Orders Load Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
