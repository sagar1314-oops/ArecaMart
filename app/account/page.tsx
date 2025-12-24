"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { User, Package, Settings, LogOut } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";

import { AuthModal } from "@/components/auth/AuthModal";
import { LogIn } from "lucide-react";

function AccountContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Profile Data State
  const [profileData, setProfileData] = useState({
    name: "Guest",
    email: "guest@example.com",
    phone: "",
    address: "",
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load profile only if logged in
  useEffect(() => {
    async function loadProfile() {
      if (!session?.user) {
        setIsLoadingProfile(false);
        return;
      }
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfileData({
            name: data.name || session.user.name || "Farmer",
            email: data.email || session.user.email || "",
            phone: data.phone || (session.user as any).phone || "",
            address: data.address || "",
          });
        }
      } catch (e) {
        console.error("Failed to load profile", e);
      } finally {
        setIsLoadingProfile(false);
      }
    }
    loadProfile();
  }, [session]);

  // Handle Tab Change
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "orders") {
      setActiveTab("orders");
    }
  }, [searchParams]);

  // Fetch orders only if logged in
  useEffect(() => {
    if (activeTab === "orders" && session?.user) {
      fetchOrders();
    }
  }, [activeTab, session]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/user/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!session) {
      toast.error("Please login to save your profile");
      setShowAuthModal(true);
      return;
    }

    // Phone number validation
    if (profileData.phone && profileData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (profileData.phone && !/^\d{10}$/.test(profileData.phone)) {
      toast.error("Invalid phone number format");
      return;
    }

    setIsEditing(false);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("An error occurred while saving.");
    }
  };

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert("Account deletion request submitted."); // This could also be a toast if desired
      toast.info("Account deletion request submitted.");
    }
  };

  const renderContent = () => {
    // Guest View for Profile
    if (!session && activeTab === "profile") {
      return (
        <div className="border rounded-lg p-6 bg-card text-center py-12">
          <User className="h-16 w-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Welcome, Guest!</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Log in to view your profile details, manage orders, and save your
            preferences.
          </p>
          <Button
            onClick={() => setShowAuthModal(true)}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Login / Sign Up
          </Button>
        </div>
      );
    }

    // Guest View for Restricted Tabs
    if (!session && (activeTab === "orders" || activeTab === "settings")) {
      return (
        <div className="border rounded-lg p-6 bg-card text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to access your {activeTab}.
          </p>
          <Button onClick={() => setShowAuthModal(true)} size="lg">
            Login Now
          </Button>
        </div>
      );
    }

    switch (activeTab) {
      case "profile":
        return (
          <div className="border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Full Name</label>
                {isEditing ? (
                  <Input
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                ) : (
                  <div className="p-2 border rounded-md bg-muted/50">
                    {profileData.name}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                {isEditing ? (
                  <Input
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                ) : (
                  <div className="p-2 border rounded-md bg-muted/50">
                    {profileData.email}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Phone</label>
                {isEditing ? (
                  <Input
                    type="tel"
                    maxLength={10}
                    value={profileData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        setProfileData({ ...profileData, phone: value });
                      }
                    }}
                    placeholder="10-digit phone number"
                  />
                ) : (
                  <div className="p-2 border rounded-md bg-muted/50">
                    {profileData.phone || "Not provided"}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Address</label>
                {isEditing ? (
                  <Input
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="p-2 border rounded-md bg-muted/50">
                    {profileData.address}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-6">My Orders</h2>
            {loadingOrders ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders found</p>
                <Link href="/arecanut">
                  <Button
                    variant="link"
                    className="mt-2 text-green-600 text-white"
                  >
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-medium">
                          Order #{order.user_order_number ?? order.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          ₹{order.total_amount.toLocaleString()}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 capitalize">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.order_items.map((item: any) => (
                        <div
                          key={item.products.id}
                          className="flex gap-4 text-sm"
                        >
                          <div className="h-10 w-10 bg-muted rounded overflow-hidden">
                            <img
                              src={item.products.image_url}
                              alt={item.products.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p>{item.products.name}</p>
                            <p className="text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "settings":
        return (
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your orders
                  </p>
                </div>
                <Button
                  variant={emailNotifications ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                >
                  {emailNotifications ? "Enabled" : "Disabled"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">SMS Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Get price alerts on your phone
                  </p>
                </div>
                <Button
                  variant={smsAlerts ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSmsAlerts(!smsAlerts)}
                >
                  {smsAlerts ? "Enabled" : "Disabled"}
                </Button>
              </div>
              <div className="pt-6 border-t">
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container px-4 py-8 md:px-6">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <Button
            variant={activeTab === "profile" ? "secondary" : "ghost"}
            className="w-full justify-start"
            size="lg"
            onClick={() => setActiveTab("profile")}
          >
            <User className="mr-2 h-4 w-4" /> Profile
          </Button>
          <Button
            variant={activeTab === "orders" ? "secondary" : "ghost"}
            className="w-full justify-start"
            size="lg"
            onClick={() => setActiveTab("orders")}
          >
            <Package className="mr-2 h-4 w-4" /> Orders
          </Button>
          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            className="w-full justify-start"
            size="lg"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
          {session ? (
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              size="lg"
              onClick={() => {
                toast.info("Signing out...");
                signOut({ callbackUrl: "/" });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          ) : (
            <Button
              className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
              size="lg"
              onClick={() => setShowAuthModal(true)}
            >
              <LogIn className="mr-2 h-4 w-4" /> Login / Sign Up
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="md:col-span-2">{renderContent()}</div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={<div className="container px-4 py-8">Loading account...</div>}
    >
      <AccountContent />
    </Suspense>
  );
}
