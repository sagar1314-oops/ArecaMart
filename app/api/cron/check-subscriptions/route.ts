import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This route should be protected or secret-guarded in production
export async function GET() {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Deactivate expired sellers
    const expiredSellers = await prisma.sellers.findMany({
      where: {
        is_active: true,
        subscription_end_at: { lt: today },
      },
      include: { users: true },
    });

    for (const seller of expiredSellers) {
      // Deactivate matches
      await prisma.sellers.update({
        where: { id: seller.id },
        data: { is_active: false },
      });

      console.log(
        `[CRON] Deactivated seller ${seller.id} (${seller.users.name}). Subscription expired.`
      );
      // Mock Email
      console.log(
        `[EMAIL] To: ${
          seller.users.email || seller.users.phone
        } | Subject: Subscription Expired | Body: Your subscription has expired. Please renew to restore product visibility.`
      );
    }

    // 2. Mock 1-day warning
    const warningSellers = await prisma.sellers.findMany({
      where: {
        is_active: true,
        subscription_end_at: {
          gt: today,
          lt: tomorrow,
        },
      },
      include: { users: true },
    });

    for (const seller of warningSellers) {
      console.log(
        `[EMAIL] To: ${
          seller.users.email || seller.users.phone
        } | Subject: Subscription Expiring Soon | Body: Your subscription expires in less than 24 hours.`
      );
    }

    return NextResponse.json({
      success: true,
      deactivatedCount: expiredSellers.length,
      warningsSent: warningSellers.length,
    });
  } catch (error) {
    console.error("Cron failed", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
