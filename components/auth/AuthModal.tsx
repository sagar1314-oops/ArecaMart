"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Phone,
  KeyRound,
  User,
  MapPin,
  Mail,
  Store,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { SELLER_PLANS } from "@/config/pricing";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const MapAddressPicker = dynamic(
  () => import("@/components/ui/MapAddressPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] bg-gray-100 animate-pulse rounded-md" />
    ),
  }
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [step, setStep] = useState<"details" | "otp">("details");

  // Form State
  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
    name: "",
    email: "",
    address: "",
    role: "buyer" as "buyer" | "seller",
    plan: SELLER_PLANS.TRIAL.id as string,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (mode === "signup") {
      if (!formData.name.trim()) {
        toast.error("Full Name is required");
        return;
      }
      if (!formData.address.trim()) {
        toast.error("Address is required");
        return;
      }
    }

    setLoading(true);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, mode }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP sent to your phone");
        console.log("OTP DEBUG:", data.debug_otp);
        setStep("otp");
      } else {
        if (res.status === 404 && data.code === "USER_NOT_FOUND") {
          toast.error("Account not found. Switching to Create Account...", {
            duration: 3000,
          }); // Informative toast
          setMode("signup"); // Auto-switch tab
        } else {
          toast.error(data.error || "Failed to send OTP");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp.length < 6) {
      toast.error("Please enter a valid OTP");
      return;
    }

    setLoading(true);

    // Payment Logic for New Sellers with Paid Plans
    if (
      mode === "signup" &&
      formData.role === "seller" &&
      formData.plan !== "trial"
    ) {
      try {
        const Razorpay = (window as any).Razorpay;
        if (!Razorpay) {
          toast.error("Payment SDK not loaded");
          setLoading(false);
          return;
        }

        // Mock Order Creation (In real app, call /api/payment/create-order)
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1234567890", // Placeholder
          amount: formData.plan === "1y" ? 499900 : 99900, // Amount in paise
          currency: "INR",
          name: "ArecaMart Subscription",
          description: `Plan: ${formData.plan}`,
          image: "/logo-v3.png",
          handler: async function (response: any) {
            // Payment Success
            await proceedLogin({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: "#16a34a" },
        };

        const rzp1 = new Razorpay(options);
        rzp1.on("payment.failed", function (response: any) {
          toast.error(`Payment Failed: ${response.error.description}`);
          setLoading(false);
        });
        rzp1.open();
        return; // Stop here, wait for payment handler
      } catch (err) {
        console.error(err);
        toast.error("Payment initiation failed");
        setLoading(false);
        return;
      }
    }

    // Default Login (Trial or Buyer)
    await proceedLogin();
  };

  const proceedLogin = async (paymentData?: any) => {
    try {
      const res = await signIn("credentials", {
        phone: formData.phone,
        otp: formData.otp,
        role: formData.role,
        plan: formData.plan,
        name: formData.name,
        email: formData.email,
        address: formData.address,
        paymentId: paymentData?.paymentId, // Pass payment ID if applicable
        redirect: false,
      });

      if (res?.ok) {
        toast.success("Login successful! Redirecting...");
        const session: any = await getSession();
        router.refresh();
        if (session?.user?.role === "admin") router.push("/");
        else if (session?.user?.role === "seller") router.push("/seller");
        else router.push("/");
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 300);
      } else {
        toast.error("Invalid OTP or Login Failed");
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep("details");
    setFormData((prev) => ({ ...prev, otp: "" }));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(val) => {
        if (!val) resetForm();
        onClose();
      }}
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <DialogContent className="sm:max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-green-100 dark:border-green-900 shadow-2xl p-0 overflow-hidden gap-0">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white text-center">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {step === "otp" ? "Verify Phone" : "Welcome to ArecaMart"}
          </DialogTitle>
          <DialogDescription className="text-green-50 text-sm mt-1 opacity-90">
            {step === "otp"
              ? `Enter the code sent to ${formData.phone}`
              : "The reliable marketplace for Arecanut trading"}
          </DialogDescription>
        </div>

        {/* Tabs (Only visible in details step) */}
        {step === "details" && (
          <div className="flex border-b border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setMode("login")}
              className={cn(
                "flex-1 py-4 text-sm font-medium transition-colors relative",
                mode === "login"
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground hover:bg-gray-50 dark:hover:bg-slate-800/50"
              )}
            >
              Login
              {mode === "login" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full mx-6" />
              )}
            </button>
            <button
              onClick={() => setMode("signup")}
              className={cn(
                "flex-1 py-4 text-sm font-medium transition-colors relative",
                mode === "signup"
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground hover:bg-gray-50 dark:hover:bg-slate-800/50"
              )}
            >
              Create Account
              {mode === "signup" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full mx-6" />
              )}
            </button>
          </div>
        )}

        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {step === "details" ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              {/* Common Field: Phone */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Phone Number
                </Label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                  <Input
                    id="phone"
                    placeholder="9876543210"
                    className="pl-10 h-10 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500/20 transition-all"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      handleInputChange(
                        "phone",
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    disabled={loading}
                    maxLength={10}
                  />
                </div>
              </div>

              {mode === "signup" && (
                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        className="pl-10 h-10 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Email ID{" "}
                      <span className="text-xs opacity-50 lowercase font-normal">
                        (optional)
                      </span>
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-10 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                      <Input
                        id="address"
                        placeholder="City, State"
                        className="pl-10 h-10 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Map Address Picker */}
                  <div className="pt-2">
                    <MapAddressPicker
                      onAddressSelect={(addr) =>
                        handleInputChange("address", addr)
                      }
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-3 pt-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Select Role
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={cn(
                          "cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                          formData.role === "buyer"
                            ? "border-green-600 bg-green-50/50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            : "border-transparent bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700"
                        )}
                      >
                        <input
                          type="radio"
                          className="hidden"
                          name="role"
                          value="buyer"
                          checked={formData.role === "buyer"}
                          onChange={() => handleInputChange("role", "buyer")}
                        />
                        <User className="h-6 w-6 mb-2" />
                        <span className="font-semibold text-sm">Buyer</span>
                      </label>
                      <label
                        className={cn(
                          "cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                          formData.role === "seller"
                            ? "border-green-600 bg-green-50/50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            : "border-transparent bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700"
                        )}
                      >
                        <input
                          type="radio"
                          className="hidden"
                          name="role"
                          value="seller"
                          checked={formData.role === "seller"}
                          onChange={() => handleInputChange("role", "seller")}
                        />
                        <Store className="h-6 w-6 mb-2" />
                        <span className="font-semibold text-sm">Seller</span>
                      </label>
                    </div>
                  </div>

                  {/* Seller Pricing Logic */}
                  {formData.role === "seller" && (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Select Subscription Plan
                      </Label>
                      <div className="grid grid-cols-1 gap-3">
                        {Object.values(SELLER_PLANS).map((plan) => (
                          <div
                            key={plan.id}
                            onClick={() => handleInputChange("plan", plan.id)}
                            className={cn(
                              "cursor-pointer relative flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:shadow-md",
                              formData.plan === plan.id
                                ? "border-green-600 bg-green-50/50 dark:bg-green-900/20"
                                : "border-transparent bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "h-5 w-5 rounded-full border flex items-center justify-center",
                                  formData.plan === plan.id
                                    ? "border-green-600 bg-green-600"
                                    : "border-gray-400"
                                )}
                              >
                                {formData.plan === plan.id && (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-sm flex items-center gap-2">
                                  {plan.name}
                                  {plan.id === "trial" && (
                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                      Default
                                    </span>
                                  )}
                                  {plan.id === "1y" && (
                                    <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                      Best Value
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {plan.duration} access · {plan.features[0]}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {plan.price === 0 ? (
                                <span className="font-bold text-green-600 text-lg">
                                  FREE
                                </span>
                              ) : (
                                <span className="font-bold text-lg">
                                  ₹{plan.price}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11 rounded-lg shadow-lg hover:shadow-xl transition-all mt-4"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "login" ? "Get OTP" : "Create Account"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-pulse">
                  <KeyRound className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-center space-y-1">
                  <Label htmlFor="otp" className="text-lg font-semibold">
                    Enter One-Time Password
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    We've sent a code to your phone +91{" "}
                    {formData.phone.replace(/(\d{5})/g, "$1 ").trim()}
                  </p>
                </div>
              </div>

              <div className="relative">
                <Input
                  id="otp"
                  placeholder="000 000"
                  className="text-center text-3xl tracking-[1em] h-14 font-mono font-bold bg-gray-50 dark:bg-slate-800 border-2 focus:border-green-500 transition-all"
                  type="text"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) =>
                    handleInputChange("otp", e.target.value.replace(/\D/g, ""))
                  }
                  disabled={loading}
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 h-11 text-lg font-medium shadow-md text-white"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & Login
              </Button>

              <button
                type="button"
                onClick={() => setStep("details")}
                className="w-full text-sm text-muted-foreground hover:text-green-600 font-medium transition-colors"
                disabled={loading}
              >
                Start Over
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
