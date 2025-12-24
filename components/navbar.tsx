"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  HelpCircle,
  CloudSun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { useSearch } from "@/contexts/SearchContext";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false); // For mobile menu
  const { searchQuery, setSearchQuery } = useSearch();
  const { cartCount } = useCart();
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = (session?.user as any)?.role;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-green-50/95 dark:bg-green-950/95 backdrop-blur supports-[backdrop-filter]:bg-green-50/60 dark:supports-[backdrop-filter]:bg-green-950/60">
      <div className="container flex h-20 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <img
              src="/logo-v3.png"
              alt="ArecaMart Logo"
              width={80}
              height={80}
              className="rounded-full p-1"
              style={{ imageRendering: "auto" }}
            />
          </Link>
          <nav className="flex items-center space-x-2 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors px-4 py-2 rounded-full",
                isActive("/")
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
              )}
            >
              Home
            </Link>
            <Link
              href="/marketRates"
              className={cn(
                "transition-colors px-4 py-2 rounded-full",
                isActive("/marketRates")
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
              )}
            >
              Market Rates
            </Link>

            {/* Shop Dropdown */}
            <div className="relative group">
              <button
                className={cn(
                  "flex items-center gap-1 transition-colors px-4 py-2 rounded-full",
                  isActive("/arecanut") ||
                    isActive("/farm-accessories") ||
                    isActive("/fertilizers")
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                )}
              >
                Shop
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown Content */}
              <div className="absolute top-full left-0 pt-2 w-56 hidden group-hover:block hover:block">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-green-100 dark:border-green-900 p-2 space-y-1">
                  <Link
                    href="/arecanut"
                    className={cn(
                      "block px-4 py-2 rounded-md text-sm transition-colors",
                      isActive("/arecanut")
                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 font-medium"
                        : "hover:bg-green-50 dark:hover:bg-green-900/20"
                    )}
                  >
                    Arecanut Plants
                  </Link>
                  <Link
                    href="/farm-accessories"
                    className={cn(
                      "block px-4 py-2 rounded-md text-sm transition-colors",
                      isActive("/farm-accessories")
                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 font-medium"
                        : "hover:bg-green-50 dark:hover:bg-green-900/20"
                    )}
                  >
                    Farm Accessories
                  </Link>
                  <Link
                    href="/fertilizers"
                    className={cn(
                      "block px-4 py-2 rounded-md text-sm transition-colors",
                      isActive("/fertilizers")
                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 font-medium"
                        : "hover:bg-green-50 dark:hover:bg-green-900/20"
                    )}
                  >
                    Fertilizers
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/sell"
              className={cn(
                "transition-colors px-4 py-2 rounded-full",
                isActive("/sell")
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
              )}
            >
              Sell Arecanut
            </Link>

            <Link
              href="/blog"
              className={cn(
                "transition-colors px-4 py-2 rounded-full",
                isActive("/blog")
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
              )}
            >
              Blog
            </Link>

            {role === "seller" && (
              <Link
                href="/seller"
                className={cn(
                  "transition-colors px-4 py-2 rounded-full",
                  isActive("/seller")
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                )}
              >
                Seller Dash
              </Link>
            )}

            {role === "admin" && (
              <Link
                href="/admin"
                className={cn(
                  "transition-colors px-4 py-2 rounded-full",
                  isActive("/admin")
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                )}
              >
                Admin Dash
              </Link>
            )}
          </nav>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </button>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden md:block md:w-auto md:flex-none md:max-w-md">
            {/* Search Bar - Hidden on mobile */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            {role !== "admin" && (
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/cart" title="Cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/weather" title="Weather Forecast">
                <CloudSun className="h-5 w-5" />
                <span className="sr-only">Weather</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/help" title="Help/Support">
                <HelpCircle className="h-5 w-5" />
                <span className="sr-only">Help</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account" title="User">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
      {isMenuOpen && (
        <div className="container md:hidden py-4 px-4 border-t">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "text-sm font-medium transition-colors px-4 py-2 rounded-md",
                isActive("/") && pathname === "/"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
              )}
            >
              Home
            </Link>
            <Link
              href="/marketRates"
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "text-sm font-medium transition-colors px-4 py-2 rounded-md",
                isActive("/marketRates")
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
              )}
            >
              Market Rates
            </Link>

            {/* Mobile Shop Menu */}
            <div>
              <button
                onClick={() => setIsShopOpen(!isShopOpen)}
                className={cn(
                  "flex items-center justify-between w-full text-sm font-medium transition-colors px-4 py-2 rounded-md",
                  isActive("/arecanut") ||
                    isActive("/farm-accessories") ||
                    isActive("/fertilizers")
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                )}
              >
                Shop
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isShopOpen ? "rotate-180" : ""
                  )}
                />
              </button>

              {isShopOpen && (
                <div className="pl-4 mt-1 space-y-1 border-l-2 border-green-100 dark:border-green-900 ml-4">
                  <Link
                    href="/arecanut"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block text-sm font-medium transition-colors px-4 py-2 rounded-md",
                      isActive("/arecanut")
                        ? "text-green-600"
                        : "text-foreground/60 hover:text-foreground"
                    )}
                  >
                    Arecanut Plants
                  </Link>
                  <Link
                    href="/farm-accessories"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block text-sm font-medium transition-colors px-4 py-2 rounded-md",
                      isActive("/farm-accessories")
                        ? "text-green-600"
                        : "text-foreground/60 hover:text-foreground"
                    )}
                  >
                    Farm Accessories
                  </Link>
                  <Link
                    href="/fertilizers"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block text-sm font-medium transition-colors px-4 py-2 rounded-md",
                      isActive("/fertilizers")
                        ? "text-green-600"
                        : "text-foreground/60 hover:text-foreground"
                    )}
                  >
                    Fertilizers
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/sell"
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "text-sm font-medium transition-colors px-4 py-2 rounded-md",
                isActive("/sell")
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
              )}
            >
              Sell Arecanut
            </Link>

            <Link
              href="/blog"
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "text-sm font-medium transition-colors px-4 py-2 rounded-md",
                isActive("/blog")
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
              )}
            >
              Blog
            </Link>

            {role === "seller" && (
              <Link
                href="/seller"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors px-4 py-2 rounded-md",
                  isActive("/seller")
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                )}
              >
                Seller Dash
              </Link>
            )}

            {role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors px-4 py-2 rounded-md",
                  isActive("/admin")
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                )}
              >
                Admin Dash
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
