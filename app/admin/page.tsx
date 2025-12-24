"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Loader2,
  Package,
  ShoppingCart,
  Users,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";

// Register Ag-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface SellerRow {
  id: number;
  is_active: boolean;
  subscription_end_at: string | null;
  users: { name: string | null; phone: string; email: string | null };
  _count: {
    products: number;
    in_stock: number;
    low_stock: number;
    oos: number;
  };
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"sellers" | "products" | "orders">(
    "sellers"
  );

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your marketplace ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("sellers")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
              activeTab === "sellers"
                ? "bg-white dark:bg-slate-900 shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="h-4 w-4" /> Sellers
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
              activeTab === "products"
                ? "bg-white dark:bg-slate-900 shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Package className="h-4 w-4" /> Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
              activeTab === "orders"
                ? "bg-white dark:bg-slate-900 shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ShoppingCart className="h-4 w-4" /> Orders
          </button>
        </div>
      </div>

      {activeTab === "sellers" && <SellerManager />}
      {activeTab === "products" && <ProductManager />}
      {activeTab === "orders" && <OrderManager />}
    </div>
  );
}

function SellerManager() {
  const [sellers, setSellers] = useState<SellerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [subEdits, setSubEdits] = useState<Record<number, string>>({});

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/sellers");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setSellers(data.sellers);
    } catch (e: any) {
      toast.error(e.message || "Failed to load sellers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const updateSeller = async (sellerId: number, payload: any) => {
    const res = await fetch("/api/admin/sellers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sellerId, ...payload }),
    });
    const data = await res.json();
    if (!res.ok || !data.success)
      throw new Error(data.error || "Update failed");
  };

  const toggleActive = async (sellerId: number, current: boolean) => {
    try {
      await updateSeller(sellerId, { isActive: !current });
      toast.success(!current ? "Seller activated" : "Seller deactivated");
      fetchSellers();
    } catch (e: any) {
      toast.error(e.message || "Toggle failed");
    }
  };

  const saveSubscription = async (sellerId: number) => {
    try {
      const date = subEdits[sellerId];
      if (!date) throw new Error("Select a date");
      await updateSeller(sellerId, { subscriptionEndAt: date });
      toast.success("Subscription updated");
      fetchSellers();
    } catch (e: any) {
      toast.error(e.message || "Update failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="grid gap-4">
        {sellers.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            No sellers found.
          </p>
        ) : (
          sellers.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-slate-900 border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-lg">
                      {s.users.name?.[0] || "U"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {s.users.name || "Unknown Seller"}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {s.users.phone}
                        {s.users.email && (
                          <span className="opacity-50">| {s.users.email}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {(() => {
                    const isSubExpired =
                      s.subscription_end_at &&
                      new Date(s.subscription_end_at) < new Date();

                    // Subscription expiry overrides is_active
                    const statusLabel = isSubExpired
                      ? "Expired"
                      : s.is_active
                      ? "Active"
                      : "Inactive";

                    const statusColor = isSubExpired
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : s.is_active
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200";

                    return (
                      <>
                        <div
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border",
                            statusColor
                          )}
                        >
                          {statusLabel}
                        </div>
                        <div className="relative group">
                          <Button
                            size="sm"
                            variant={s.is_active ? "destructive" : "default"}
                            className={cn(
                              "font-semibold shadow-sm transition-all duration-200",
                              s.is_active
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-green-600 hover:bg-green-700 text-white",
                              isSubExpired && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={() =>
                              !isSubExpired && toggleActive(s.id, s.is_active)
                            }
                            disabled={!!isSubExpired}
                          >
                            {s.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          {isSubExpired && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Subscription has ended, please renew
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase text-muted-foreground">
                    Subscription Expiry
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      className="max-w-[200px]"
                      value={
                        subEdits[s.id] ??
                        (s.subscription_end_at
                          ? new Date(s.subscription_end_at)
                              .toISOString()
                              .split("T")[0]
                          : "")
                      }
                      onChange={(e) =>
                        setSubEdits((prev) => ({
                          ...prev,
                          [s.id]: e.target.value,
                        }))
                      }
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className={cn(
                        "font-semibold shadow-sm transition-all duration-200",
                        s.subscription_end_at &&
                          new Date(s.subscription_end_at) < new Date()
                          ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      )}
                      onClick={() => saveSubscription(s.id)}
                    >
                      {s.subscription_end_at &&
                      new Date(s.subscription_end_at) < new Date()
                        ? "Renew"
                        : "Update"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase text-muted-foreground">
                    Stats
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg min-w-[100px]">
                      <div className="text-2xl font-bold">
                        {s._count.products}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Products
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg min-w-[100px]">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {s._count.in_stock}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        In Stock
                      </div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg min-w-[100px]">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {s._count.low_stock}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Low Stock
                      </div>
                    </div>
                    <div className="text-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg min-w-[100px]">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {s._count.oos}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Out of Stock
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sellersList, setSellersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, sellRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/categories"),
        fetch("/api/admin/sellers"),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      const sellData = await sellRes.json();

      if (prodData.success) setProducts(prodData.products);
      if (catData.success) setCategories(catData.categories);
      if (sellData.success) setSellersList(sellData.sellers);
    } catch (e) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product? Irreversible.")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      if ((await res.json()).success) {
        toast.success("Deleted");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else throw new Error("Failed");
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      if ((await res.json()).success) {
        toast.success("Updated");
        setEditingProduct(null);
        fetchData();
      } else throw new Error("Failed");
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const columnDefs: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      pinned: "left",
      cellStyle: { fontFamily: "monospace", fontSize: "12px" },
    },
    {
      headerName: "Product Name",
      field: "name",
      width: 250,
      pinned: "left",
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2 py-1">
          <img
            src={params.data.image_url || "/placeholder.png"}
            className="h-8 w-8 rounded object-cover border"
            alt=""
          />
          <span className="truncate">{params.value}</span>
        </div>
      ),
    },
    {
      headerName: "Seller",
      field: "sellers.users.name",
      width: 150,
      pinned: "left",
      valueGetter: (params) => params.data.sellers?.users?.name || "Unknown",
    },
    { field: "categories.name", headerName: "Category", width: 120 },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      tooltipField: "description",
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      valueFormatter: (params) => `₹${params.value}`,
      cellClass: "font-bold text-green-600",
    },
    {
      field: "rating",
      headerName: "Rate",
      width: 80,
      valueFormatter: (params) => Number(params.value || 0).toFixed(1),
    },
    { field: "review_count", headerName: "Reviews", width: 90 },
    {
      field: "badge",
      headerName: "Badge",
      width: 100,
      cellRenderer: (params: any) =>
        params.value ? (
          <span className="px-1.5 py-0.5 rounded border bg-yellow-50 text-yellow-700 text-[10px] border-yellow-200">
            {params.value}
          </span>
        ) : null,
    },
    { field: "sold_count", headerName: "Sold", width: 80 },
    {
      headerName: "Inventory",
      field: "stock_qty",
      width: 140,
      pinned: "right",
      valueGetter: (params) => {
        const qty = params.data.stock_qty || 0;
        const isActive = params.data.is_active;
        const isSellerActive =
          params.data.sellers?.is_active === 1 ||
          params.data.sellers?.is_active === true;
        const subEnd = params.data.sellers?.subscription_end_at;
        const isSubExpired = subEnd && new Date(subEnd) < new Date();

        // Products are hidden from marketplace if inactive/seller inactive/expired
        if (!isActive) return `${qty} (Hidden - Inactive)`;
        if (!isSellerActive) return `${qty} (Hidden - Seller Inactive)`;
        if (isSubExpired) return `${qty} (Hidden - Expired)`;

        // OOS only for zero stock
        if (qty === 0) return `0 (Out of Stock)`;
        if (qty <= 10) return `${qty} (Low Stock)`;
        return `${qty} (In Stock)`;
      },
      cellRenderer: (params: any) => {
        const qty = params.data.stock_qty || 0;
        const isActive = params.data.is_active;
        const isSellerActive =
          params.data.sellers?.is_active === 1 ||
          params.data.sellers?.is_active === true;
        const subEnd = params.data.sellers?.subscription_end_at;
        const isSubExpired = subEnd && new Date(subEnd) < new Date();

        let badgeClass = "";
        let label = "";

        // Hidden products (gray badge)
        if (!isActive) {
          badgeClass = "bg-gray-50 text-gray-700 border-gray-200";
          label = "Hidden (Inactive)";
        } else if (!isSellerActive) {
          badgeClass = "bg-gray-50 text-gray-700 border-gray-200";
          label = "Hidden (Seller Inactive)";
        } else if (isSubExpired) {
          badgeClass = "bg-gray-50 text-gray-700 border-gray-200";
          label = "Hidden (Expired)";
        }
        // OOS only for zero stock
        else if (qty === 0) {
          badgeClass = "bg-red-50 text-red-700 border-red-200";
          label = "Out of Stock";
        } else if (qty <= 10) {
          badgeClass = "bg-yellow-50 text-yellow-700 border-yellow-200";
          label = "Low Stock";
        } else {
          badgeClass = "bg-green-50 text-green-700 border-green-200";
          label = "In Stock";
        }

        return (
          <div className="flex items-center gap-2 py-1">
            <span className="font-mono font-bold w-6">{qty}</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-medium border",
                badgeClass
              )}
            >
              {label}
            </span>
          </div>
        );
      },
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 120,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "-",
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 120,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "-",
    },
    {
      headerName: "Status",
      width: 130,
      pinned: "right",
      valueGetter: (params) => {
        const isProductActive = params.data.is_active;
        // Fix: Don't default to true if seller data is missing
        const isSellerActive =
          params.data.sellers?.is_active === 1 ||
          params.data.sellers?.is_active === true;
        const subEnd = params.data.sellers?.subscription_end_at;
        const isSubExpired = subEnd && new Date(subEnd) < new Date();

        if (!isProductActive) return "Inactive";
        if (!isSellerActive) return "Seller Inactive";
        if (isSubExpired) return "Expired";
        return "Active";
      },
      cellRenderer: (params: any) => {
        const status = params.value;
        const isGreen = status === "Active";
        const isYellow = status === "Expired";

        return (
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-medium border",
              isGreen
                ? "bg-green-50 text-green-700 border-green-200"
                : isYellow
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : "bg-red-50 text-red-700 border-red-200"
            )}
          >
            {status}
          </span>
        );
      },
    },
    {
      headerName: "Actions",
      width: 100,
      pinned: "right",
      cellRenderer: (params: any) => (
        <div className="flex justify-end gap-1 py-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-blue-600"
            onClick={() => setEditingProduct(params.data)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-600"
            onClick={() => handleDelete(params.data.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 0,
  };

  if (loading)
    return <Loader2 className="h-8 w-8 animate-spin mx-auto my-10" />;

  return (
    <div className="space-y-4 animate-in fade-in">
      <div
        className="shadow-sm border rounded-lg overflow-hidden"
        style={{ height: "600px", width: "100%" }}
      >
        <AgGridReact
          theme={themeQuartz}
          rowData={products}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
          animateRows={true}
          headerHeight={48}
          rowHeight={48}
        />
      </div>

      <Dialog
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
      >
        <DialogContent className="max-w-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product {editingProduct?.id}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  value={editingProduct?.name || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={editingProduct?.price || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                value={editingProduct?.category_id || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category_id: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Seller</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                value={editingProduct?.seller_id || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    seller_id: e.target.value,
                  })
                }
              >
                <option value="">Select Seller</option>
                {sellersList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.users.name || "Unknown"}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Stock Quantity</Label>
              <Input
                type="number"
                value={editingProduct?.stock_qty || 0}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stock_qty: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editingProduct?.description || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Subtype</Label>
                <Input
                  value={editingProduct?.subtype || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      subtype: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Badge</Label>
                <Input
                  value={editingProduct?.badge || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      badge: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-active"
                checked={editingProduct?.is_active ?? true}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    is_active: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-green-600"
              />
              <Label htmlFor="edit-active">Active</Label>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingProduct(null)}
                className="px-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setOrders(data.orders);
    } catch (e) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Group orders by "Seller" is tricky because orders can be multi-seller.
  // Instead, we can flat-map the orders into "Items Sold" grouped by Seller using the nested relations.
  // Structure: Seller -> [Item 1 (Order A), Item 2 (Order B)]
  // This gives a seller-centric view of sales.

  const sellerSales = orders
    .flatMap((order) =>
      order.order_items.map((item: any) => ({
        ...item,
        orderId: order.id,
        customerName: order.users?.name,
        orderDate: order.created_at,
        status: order.status,
        sellerName: item.products?.sellers?.users?.name || "Unknown",
      }))
    )
    .reduce((acc: any, item: any) => {
      const seller = item.sellerName;
      if (!acc[seller]) acc[seller] = [];
      acc[seller].push(item);
      return acc;
    }, {});

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {Object.keys(sellerSales).length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          No orders found.
        </p>
      ) : (
        Object.entries(sellerSales).map(([sellerName, items]: any) => (
          <div key={sellerName} className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" /> {sellerName}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({items.length} items sold)
              </span>
            </h2>

            <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item: any, idx: number) => (
                    <tr key={`${item.id}-${idx}`} className="hover:bg-muted/30">
                      <td className="p-3 font-medium">#{item.orderId}</td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(item.orderDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">{item.products?.name}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">{item.customerName || "Guest"}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}


