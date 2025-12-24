import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET: Fetch user's cart
export async function GET() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ cart: [] }); // Guest cart is handled by client-side localStorage
    }

    const userId = parseInt(session.user.id);

    const cart = await prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        cart_items: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ cart: [] });
    }

    // Format for frontend
    const formattedCart = cart.cart_items.map((item) => ({
      id: item.products.id,
      name: item.products.name,
      price: item.products.price,
      image: item.products.image_url,
      quantity: item.quantity,
      category: item.products.subtype || "General",
    }));

    return NextResponse.json(formattedCart);
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST: Add/Update item in cart
export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, quantity } = await req.json(); // Product ID and Quantity
    const userId = parseInt(session.user.id);

    // 1. Get or Create Cart
    let cart = await prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { user_id: userId },
      });
    }

    // 2. Check if item exists
    const existingItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        product_id: parseInt(id),
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { quantity: quantity }, // If 0, should delete? Let's check logic
      });
    } else {
      // Create new item
      await prisma.cart_items.create({
        data: {
          cart_id: cart.id,
          product_id: parseInt(id),
          quantity: quantity,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update Cart Error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE: Remove item from cart or clear cart
export async function DELETE(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const userId = parseInt(session.user.id);
    const cart = await prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (cart) {
      if (productId) {
        await prisma.cart_items.deleteMany({
          where: {
            cart_id: cart.id,
            product_id: parseInt(productId),
          },
        });
      } else {
        await prisma.cart_items.deleteMany({
          where: { cart_id: cart.id },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete from Cart Error:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
