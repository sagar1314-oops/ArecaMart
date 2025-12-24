import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

async function getSellerId(userId: number) {
  const seller = await prisma.sellers.findUnique({
    where: { user_id: userId },
  });
  return seller?.id ?? null;
}

export async function GET() {
  const session: any = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "seller") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sellerId = await getSellerId(parseInt(session.user.id));
  if (!sellerId) {
    return NextResponse.json(
      { error: "Seller profile not found" },
      { status: 404 }
    );
  }

  const products = await prisma.products.findMany({
    where: { seller_id: sellerId },
    include: {
      categories: true,
      product_tags: true,
    },
    orderBy: { updated_at: "desc" },
  });

  return NextResponse.json({ success: true, products });
}

export async function POST(request: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "seller") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sellerId = await getSellerId(parseInt(session.user.id));
  if (!sellerId) {
    return NextResponse.json(
      { error: "Seller profile not found" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const {
    name,
    price,
    category_id,
    description,
    image_url,
    is_active = true,
    subtype,
    badge,
  } = body;

  if (!name || !price || !category_id) {
    return NextResponse.json(
      { error: "name, price, and category_id are required" },
      { status: 400 }
    );
  }

  const product = await prisma.products.create({
    data: {
      name,
      price: Number(price),
      category_id: Number(category_id),
      description: description || null,
      image_url: image_url || null,
      is_active: Boolean(is_active),
      seller_id: sellerId,
      subtype: subtype || null,
      badge: badge || null,
      sold_count: 0, // Initialize sold count
    },
  });

  return NextResponse.json({ success: true, product });
}

export async function PATCH(request: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "seller") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sellerId = await getSellerId(parseInt(session.user.id));
  if (!sellerId) {
    return NextResponse.json(
      { error: "Seller profile not found" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const { id, ...rest } = body;
  if (!id) {
    return NextResponse.json(
      { error: "Product id is required" },
      { status: 400 }
    );
  }

  const productId = Number(id);
  // Fetch via raw SQL to bypass stale Prisma Client model on Windows
  const existingRaw: any[] =
    await prisma.$queryRaw`SELECT seller_id, admin_deactivated FROM products WHERE id = ${productId}`;
  const existing = existingRaw[0];

  if (!existing || existing.seller_id !== sellerId) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const updateData: any = {};
  const allowed = [
    "name",
    "price",
    "category_id",
    "description",
    "image_url",
    "is_active",
    "subtype",
    "badge",
  ];
  for (const key of allowed) {
    if (rest[key] !== undefined) {
      // Restriction: If product is deactivated by admin, seller cannot activate it
      if (
        key === "is_active" &&
        rest[key] === true &&
        (existing as any).admin_deactivated
      ) {
        return NextResponse.json(
          {
            error:
              "This product has been deactivated by an admin and cannot be reactivated by the seller.",
          },
          { status: 403 }
        );
      }

      updateData[key] =
        key === "price" || key === "category_id"
          ? Number(rest[key])
          : rest[key];
    }
  }

  const product = await prisma.products.update({
    where: { id: Number(id) },
    data: updateData,
  });

  return NextResponse.json({ success: true, product });
}


