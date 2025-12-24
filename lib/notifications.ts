import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type NotificationType = "SMS" | "WHATSAPP";

interface OrderNotification {
  userId: number;
  orderId: number;
  userOrderNumber: number;
  totalAmount: number;
  items: { name: string; quantity: number }[];
  phone: string;
}

export async function sendOrderNotification(order: OrderNotification) {
  try {
    const message = `Order Placed Successfully!
Order #${order.userOrderNumber}
Amount: ₹${order.totalAmount}
Items: ${order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
Estimated Delivery: 3-5 Days`;

    // 1. Send SMS (Mock Integration)
    // using Fast2SMS, Twilio, etc.
    console.log(`[SMS] To ${order.phone}: ${message}`);

    // 2. Send WhatsApp (Mock Integration)
    // using Twilio, Interakt, etc.
    console.log(`[WHATSAPP] To ${order.phone}: ${message}`);

    // In a real app, you would make API calls here:
    // await fetch('https://api.sms-provider.com/send', { ... })

    return true;
  } catch (error) {
    console.error("Failed to send notifications:", error);
    return false;
  }
}
