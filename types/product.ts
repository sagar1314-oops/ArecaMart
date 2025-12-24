// Product type matching the database schema
export interface Product {
  id: number;
  category_id: number;
  subtype: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  rating: number | null;
  review_count: number | null;
  badge: string | null;
  sold_count: number | null;
  is_active: boolean | null;
  created_at: Date | null;
  admin_deactivated?: boolean | null;
  is_out_of_stock?: boolean | null;
  sellers?: {
    id: number;
    is_active: boolean;
    subscription_end_at: Date | null;
  } | null;
  categories: {
    id: number;
    code: string;
    name: string;
  };
  product_tags?: Array<{
    id: number;
    product_id: number;
    tag: string;
  }>;
}

// API Response type
export interface ProductsApiResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Frontend display product (simplified)
export interface DisplayProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  soldCount?: number;
  isOutOfStock?: boolean;
}
