"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product | any) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_KEY = "arecamart_cart";
const LAST_USER_KEY = "arecamart_last_user";
const GUEST_SESSION_KEY = "arecamart_guest_session";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: session, status } = useSession();
  const [previousUserId, setPreviousUserId] = useState<string | null>(null);

  // Load cart from localStorage or Server on mount/auth change
  useEffect(() => {
    if (status === "loading") return;

    const initializeCart = async () => {
      // 1. If logged in, fetch from Server
      if (session?.user) {
        try {
          const res = await fetch("/api/cart");
          if (res.ok) {
            const serverCart = await res.json();

            // Optional: Merge Strategy? For now, Server overwrites Local if Server has data.
            // If Server is empty but Local has data (first login), we could sync.
            // Let's implement active sync later if needed, for now trust Server.
            if (serverCart.length > 0) {
              setCart(serverCart);
            } else {
              // If Server empty, check Local. If Local has items, sync them up.
              const localCartStr = localStorage.getItem(CART_KEY);
              if (localCartStr) {
                const localCart = JSON.parse(localCartStr);
                if (localCart.length > 0) {
                  setCart(localCart);
                  for (const item of localCart) {
                    await fetch("/api/cart", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: item.id,
                        quantity: item.quantity,
                      }),
                    });
                  }
                } else {
                  setCart([]);
                }
              } else {
                setCart([]);
              }
            }
            localStorage.setItem(LAST_USER_KEY, (session.user as any).id);
            setPreviousUserId((session.user as any).id);
          }
        } catch (error) {
          console.error("Failed to fetch server cart", error);
        }
      } else {
        const hadUserBefore = !!previousUserId;
        const hasGuestSession = sessionStorage.getItem(GUEST_SESSION_KEY);
        const lastUserId = localStorage.getItem(LAST_USER_KEY);

        // If we have a stored logged-in user but session is gone, ensure full reset
        if (lastUserId) {
          localStorage.removeItem(CART_KEY);
          localStorage.removeItem(LAST_USER_KEY);
          sessionStorage.removeItem(GUEST_SESSION_KEY);
          setPreviousUserId(null);
          setCart([]);
        } else if (hadUserBefore) {
          // User just logged out in this session: clear guest cart and markers
          localStorage.removeItem(CART_KEY);
          localStorage.removeItem(LAST_USER_KEY);
          sessionStorage.removeItem(GUEST_SESSION_KEY);
          setPreviousUserId(null);
          setCart([]);
        } else {
          // Pure guest flow: keep cart within the same browser session
          const savedCart = localStorage.getItem(CART_KEY);
          if (savedCart) {
            try {
              setCart(JSON.parse(savedCart));
            } catch (error) {
              console.error("Failed to parse cart from localStorage:", error);
              setCart([]);
            }
          } else {
            setCart([]);
          }

          if (!hasGuestSession) {
            sessionStorage.setItem(GUEST_SESSION_KEY, "true");
          }
        }
      }
      setIsInitialized(true);
    };

    initializeCart();
  }, [session, previousUserId, status]);

  // Save cart to localStorage whenever it changes (Backup for Guest, or fallback)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      if ((session?.user as any)?.id) {
        localStorage.setItem(LAST_USER_KEY, (session?.user as any).id);
      }
    }
  }, [cart, isInitialized]);

  const addToCart = async (product: Product | any) => {
    // Optimistic Update
    let newCart: CartItem[] = [];
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price:
            typeof product.price === "string"
              ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
              : product.price,
          image:
            product.image ||
            product.image_url ||
            product.imageUrl ||
            "/products/placeholder.png",
          quantity: 1,
          category: product.category || product.categories?.name,
        };
        newCart = [...prevCart, newItem];
      }
      return newCart;
    });

    toast.success(`${product.name} added to cart`, {
      description: "You can view it in your cart.",
      action: {
        label: "View Cart",
        onClick: () => (window.location.href = "/cart"),
      },
    });

    // Server Sync
    if (session?.user) {
      try {
        // Calculate new quantity
        const item = newCart.find((i) => i.id === product.id);
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: product.id,
            quantity: item ? item.quantity : 1,
          }),
        });
      } catch (e) {
        console.error("Failed to sync add to cart", e);
      }
    }
  };

  const removeFromCart = async (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));

    // Server Sync
    if (session?.user) {
      try {
        await fetch(`/api/cart?productId=${id}`, {
          method: "DELETE",
        });
      } catch (e) {
        console.error("Failed to sync remove from cart", e);
      }
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    // Server Sync
    if (session?.user) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id, quantity: quantity }),
        });
      } catch (e) {
        console.error("Failed to sync quantity update", e);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    localStorage.setItem(CART_KEY, JSON.stringify([]));
    if (session?.user) {
      try {
        await fetch("/api/cart", { method: "DELETE" });
      } catch (e) {
        console.error("Failed to clear server cart", e);
      }
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isLoading: !isInitialized,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
