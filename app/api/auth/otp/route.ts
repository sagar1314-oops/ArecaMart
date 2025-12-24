import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { phone, mode } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Login Validation: Check if user exists
    if (mode === "login") {
      const userExists = await prisma.users.findUnique({
        where: { phone },
      });
      if (!userExists) {
        return NextResponse.json(
          {
            error: "Account not found. Please create an account.",
            code: "USER_NOT_FOUND",
          },
          { status: 404 }
        );
      }
    }

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to database
    await prisma.login_otps.create({
      data: {
        phone,
        otp_code: otpCode,
        expires_at: expiresAt,
        used: false,
      },
    });

    // In a real app, successful response would NOT return the OTP
    // But for this demo, we return it so the user can "see" the SMS
    console.log(`[OTP SERVICE] Generated OTP for ${phone}: ${otpCode}`);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      debug_otp: otpCode, // REMOVE IN PRODUCTION
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return NextResponse.json(
      { error: "Failed to generate OTP" },
      { status: 500 }
    );
  }
}
