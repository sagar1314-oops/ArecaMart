import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { SELLER_PLANS, getPlanDetails } from "@/config/pricing";

const prisma = new PrismaClient();

// Export authOptions for use in server components/APIs
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        role: { label: "Role", type: "text" },
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        address: { label: "Address", type: "text" },
        plan: { label: "Plan", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          throw new Error("Phone and OTP are required");
        }

        const { phone, otp, name, email, address, plan } = credentials as any;
        const requestedRole = (credentials.role as any) || "buyer";

        // 1. Verify OTP
        const matchedOtp = await prisma.login_otps.findFirst({
          where: {
            phone,
            otp_code: otp,
            used: false,
            expires_at: { gt: new Date() },
          },
          orderBy: {
            id: "desc",
          },
        });

        if (!matchedOtp) {
          throw new Error("Invalid or expired OTP");
        }

        // 2. Mark OTP as used
        await prisma.login_otps.update({
          where: { id: matchedOtp.id },
          data: { used: true },
        });

        // 3. Find or Create User
        let user = await prisma.users.findUnique({
          where: { phone },
        });

        if (!user) {
          // Create new user
          user = await prisma.users.create({
            data: {
              phone,
              name: name || `User ${phone.slice(-4)}`,
              email: email || null,
              address: address || null,
              role: requestedRole, // Set role on creation
              phone_verified: true,
            },
          });
        } else {
          // Update existing user details if provided
          const updateData: any = {};
          if (name) updateData.name = name;
          if (email) updateData.email = email;
          if (address) updateData.address = address;

          // Allow role upgrade if staying specifically within logic (or simple switch for demo)
          // Don't downgrade admins
          if (
            requestedRole === "seller" &&
            user.role !== "seller" &&
            user.role !== "admin"
          ) {
            // We can allow becoming a seller
            updateData.role = "seller";
          }

          if (Object.keys(updateData).length > 0) {
            user = await prisma.users.update({
              where: { id: user.id },
              data: updateData,
            });
          }
        }

        // Handle Seller Creation if Role is Seller
        let seller = await prisma.sellers.findUnique({
          where: { user_id: user.id },
        });

        if (user.role === "seller" && !seller) {
          // Determine activity status: Active if TRIAL, Inactive otherwise (awaiting payment)
          const isTrial = plan === SELLER_PLANS.TRIAL.id;
          const planDetails = getPlanDetails(plan);
          const durationDays = planDetails ? planDetails.durationInDays : 0;
          const endAt = new Date(
            Date.now() + durationDays * 24 * 60 * 60 * 1000
          );

          seller = await prisma.sellers.create({
            data: {
              user_id: user.id,
              is_active: isTrial, // Auto-active for Trial
              subscription_end_at: isTrial ? endAt : null, // Set expiry if active
            },
          });

          // Create subscription record if plan provided
          if (plan) {
            await prisma.seller_subscriptions.create({
              data: {
                seller_id: seller.id,
                plan: plan,
                status: isTrial ? "active" : "pending",
                start_at: new Date(),
                end_at: endAt,
              },
            });
          }
        }

        // Fetch seller/admin linkage if any (if not already fetched/created)
        if (!seller) {
          seller = await prisma.sellers.findUnique({
            where: { user_id: user.id },
          });
        }

        // 4. Return User object for session
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role || "buyer",
          sellerId: seller ? seller.id : null,
          warehouseId: seller?.warehouse_id ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.sellerId = user.sellerId;
        token.warehouseId = user.warehouseId;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.sellerId = token.sellerId;
        session.user.warehouseId = token.warehouseId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-secret",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
