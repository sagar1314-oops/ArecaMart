"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SellerProduct {
  id: number;
  name: string;
  price: number;
  category_id: number;
  description?: string | null;
  is_active?: boolean | null;
}

export default function SellerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    category_id: "",
    description: "",
    image_url: "",
    subtype: "",
    badge: "",
    is_active: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/seller/products"),
        fetch("/api/categories"),
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.success) setProducts(prodData.products);
      if (catData.success) setCategories(catData.categories);
    } catch (e: any) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category_id) {
      toast.error("Please select a category");
      return;
    }

    try {
      const payload: any = {
        name: form.name,
        price: Number(form.price),
        category_id: Number(form.category_id),
        description: form.description || null,
        image_url: form.image_url || null,
        subtype: form.subtype || null,
        badge: form.badge || null,
        is_active: form.is_active,
      };

      const method = form.id ? "PATCH" : "POST";
      const body = form.id ? { ...payload, id: Number(form.id) } : payload;

      const res = await fetch("/api/seller/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");

      toast.success(form.id ? "Product updated" : "Product created");
      resetForm();
      // Re-fetch only products
      const prodRes = await fetch("/api/seller/products");
      const prodData = await prodRes.json();
      if (prodData.success) setProducts(prodData.products);
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    }
  };

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      price: "",
      category_id: "",
      description: "",
      image_url: "",
      subtype: "",
      badge: "",
      is_active: true,
    });
  };

  const startEdit = (p: any) => {
    setForm({
      id: p.id.toString(),
      name: p.name,
      price: p.price.toString(),
      category_id: p.category_id.toString(),
      description: p.description || "",
      image_url: p.image_url || "",
      subtype: p.subtype || "",
      badge: p.badge || "",
      is_active: !!p.is_active,
    });
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">Add and manage your products.</p>
        </div>
        <Link href="/">
          <Button variant="outline">Back to site</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 border rounded-xl bg-white dark:bg-slate-900 shadow-sm h-fit"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              {form.id ? "Edit Product" : "Add New Product"}
            </h2>
            {form.id && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="gap-2"
              >
                <span className="text-xl leading-none">+</span> Add New Product
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              placeholder="https://..."
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="subtype">Subtype</Label>
              <Input
                id="subtype"
                placeholder="e.g. Red, Raw"
                value={form.subtype}
                onChange={(e) => setForm({ ...form, subtype: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="badge">Badge</Label>
              <Input
                id="badge"
                placeholder="e.g. Best Seller"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="active"
              type="checkbox"
              className="w-4 h-4 accent-green-600"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
            />
            <Label htmlFor="active" className="cursor-pointer">
              Active Product
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 font-bold text-white"
          >
            {form.id ? "Update Product" : "Create Product"}
          </Button>
        </form>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">
              Your Inventory ({products.length})
            </h2>
            <Button variant="ghost" size="sm" onClick={fetchData}>
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-gray-50 dark:bg-slate-800/50 text-muted-foreground">
              No products found. Start adding!
            </div>
          ) : (
            <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="group flex gap-3 p-3 border rounded-lg bg-white dark:bg-slate-900 hover:border-green-300 transition-colors"
                >
                  <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                        No Img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold truncate">{p.name}</h3>
                      <div className="text-xs font-mono bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        ID: {p.id}
                      </div>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400 font-bold">
                      ₹{p.price}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-muted-foreground">
                      <span className="bg-gray-100 dark:bg-slate-800 px-1.5 rounded">
                        {p.categories?.name}
                      </span>
                      {p.sold_count > 0 && (
                        <span className="bg-orange-100 text-orange-700 px-1.5 rounded">
                          Sold: {p.sold_count}
                        </span>
                      )}
                      {p.is_active ? (
                        <span className="text-green-600 flex items-center gap-1">
                          ● Active
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          ○ Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="self-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



