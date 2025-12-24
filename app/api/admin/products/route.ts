import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  // Strict Admin Check
  if (!session || (session.user?.role as string)?.toLowerCase() !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await prisma.$queryRaw`
      SELECT p.*, 
             c.name as category_name,
             u.name as seller_name,
             s.is_active as seller_active,
             s.subscription_end_at as seller_subscription_end_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sellers s ON p.seller_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY p.id DESC
    `;

    // Map the flat SQL results to the expected frontend structure
    const mappedProducts = (products as any[]).map((p) => ({
      ...p,
      categories: { name: p.category_name },
      sellers: {
        users: { name: p.seller_name },
        is_active: p.seller_active === 1 || p.seller_active === true,
        subscription_end_at: p.seller_subscription_end_at,
      },
    }));

    return NextResponse.json({ success: true, products: mappedProducts });
  } catch (error) {
    console.error("Admin Product Load Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    await prisma.products.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user?.role as string)?.toLowerCase() !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    // Clean data types if necessary (e.g. price to int)
    // Assuming frontend sends correct types, but let's be safe for price/category_id
    // Actually standard prisma update needs correct types.
    // If data comes from JSON used in body directly, it might need parsing.
    // user will likely iterate on this if it fails.

    // Extract only valid fields to prevent Prisma "Unknown argument" error
    // (caused by relation fields like 'sellers' being sent in body)
    const {
      name,
      price,
      category_id,
      description,
      image_url,
      subtype,
      badge,
      is_active,
      is_out_of_stock,
      seller_id,
      stock_qty,
    } = data;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (category_id !== undefined) updateData.category_id = Number(category_id);
    if (seller_id !== undefined) updateData.seller_id = Number(seller_id);
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (subtype !== undefined) updateData.subtype = subtype;
    if (badge !== undefined) updateData.badge = badge;
    if (is_active !== undefined) {
      updateData.is_active = Boolean(is_active);
    }
    // Note: admin_deactivated and is_out_of_stock are handled via Raw SQL below
    // to avoid Prisma Client runtime validation errors on stale clients.

    const productId = Number(id);
    await prisma.products.update({
      where: { id: productId },
      data: updateData as any,
    });

    // Handle new fields via Raw SQL to bypass stale Prisma Client on Windows
    if (is_active !== undefined && Boolean(is_active)) {
      await prisma.$executeRaw`UPDATE products SET admin_deactivated = 0, is_out_of_stock = 0 WHERE id = ${productId}`;
    }

    if (is_out_of_stock !== undefined) {
      const outOfStock = Boolean(is_out_of_stock);
      await prisma.$executeRaw`UPDATE products SET is_out_of_stock = ${outOfStock} WHERE id = ${productId}`;
      if (!outOfStock) {
        await prisma.$executeRaw`UPDATE products SET admin_deactivated = 0 WHERE id = ${productId}`;
      }
    }

    if (stock_qty !== undefined) {
      await prisma.$executeRaw`UPDATE products SET stock_qty = ${Number(
        stock_qty
      )} WHERE id = ${productId}`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Product Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
