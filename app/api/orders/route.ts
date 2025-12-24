import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendOrderNotification } from "@/lib/notifications";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Allow both buyers and sellers to place orders
    if (
      session.user.role &&
      session.user.role !== "buyer" &&
      session.user.role !== "seller"
    ) {
      return NextResponse.json(
        { error: "Only buyers and sellers can place orders" },
        { status: 403 }
      );
    }

    const { items, totalAmount } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Get current order count for this user for sequential numbering
    const userOrderCount = await prisma.orders.count({
      where: { user_id: parseInt(session.user.id) },
    });

    // 2. Create the Order
    const order = await prisma.orders.create({
      data: {
        user_id: parseInt(session.user.id),
        user_order_number: userOrderCount + 1,
        total_amount: totalAmount,
        status: "paid", // Mock payment success
        created_at: new Date(),
        updated_at: new Date(),
        order_items: {
          create: items.map((item: any) => ({
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.price,
          })),
        },
      } as any, // Cast to any to bypass stale type definition
    });

    // 3. Send Notifications
    // Fetch user details for phone number
    const user = await prisma.users.findUnique({
      where: { id: parseInt(session.user.id) },
    });

    if (user && user.phone) {
      // Run notification in background
      await sendOrderNotification({
        userId: user.id,
        orderId: order.id,
        userOrderNumber: (order as any).user_order_number ?? userOrderCount + 1,
        totalAmount: totalAmount,
        items: items.map((i: any) => ({ name: i.name, quantity: i.quantity })),
        phone: user.phone,
      });
    }

    // 4. Increment sold_count for each product
    for (const item of items) {
      await prisma.products.update({
        where: { id: item.id },
        data: { sold_count: { increment: item.quantity } },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      userOrderNumber: (order as any).user_order_number,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
