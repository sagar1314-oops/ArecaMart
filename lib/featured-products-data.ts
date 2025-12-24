export interface FeaturedProduct {
  id: string;
  name: string;
  categoryId: string;
  categoryLabel: string;
  price: number;
  currency: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  badge?: string;
}

export const featuredProductsData: FeaturedProduct[] = [
  {
    id: "arecanut-seedlings",
    name: "Arecanut Seedlings",
    categoryId: "plants",
    categoryLabel: "Plants",
    price: 150,
    currency: "INR",
    imageUrl: "/products/mohitnagar.png",
    rating: 4.8,
    reviewCount: 82,
    badge: "Best Seller",
  },
  {
    id: "organic-fertilizer",
    name: "Organic Fertilizer",
    categoryId: "fertilizers",
    categoryLabel: "Fertilizers",
    price: 450,
    currency: "INR",
    imageUrl: "/products/organic-fertilizer.png",
    rating: 4.7,
    reviewCount: 64,
  },
  {
    id: "pesticide-spray",
    name: "Pesticide Spray",
    categoryId: "fertilizers",
    categoryLabel: "Fertilizers",
    price: 320,
    currency: "INR",
    imageUrl: "/products/pesticide-spray.png",
    rating: 4.6,
    reviewCount: 51,
  },
  {
    id: "garden-tools-set",
    name: "Garden Tools Set",
    categoryId: "tools",
    categoryLabel: "Tools",
    price: 890,
    currency: "INR",
    imageUrl: "/products/garden-tools-set.png",
    rating: 4.8,
    reviewCount: 87,
    badge: "Best Seller",
  },
  {
    id: "drip-irrigation-kit",
    name: "Drip Irrigation Kit",
    categoryId: "tools",
    categoryLabel: "Tools",
    price: 1200,
    currency: "INR",
    imageUrl: "/products/garden-tools-set2.png",
    rating: 4.6,
    reviewCount: 53,
  },
  {
    id: "soil-testing-kit",
    name: "Soil Testing Kit",
    categoryId: "tools",
    categoryLabel: "Tools",
    price: 850,
    currency: "INR",
    imageUrl: "/products/organic-fertilizer.png",
    rating: 4.5,
    reviewCount: 32,
  },
  {
    id: "plant-growth-booster",
    name: "Plant Growth Booster",
    categoryId: "fertilizers",
    categoryLabel: "Fertilizers",
    price: 280,
    currency: "INR",
    imageUrl: "/products/pesticide-spray.png",
    rating: 4.4,
    reviewCount: 35,
  },
  {
    id: "harvesting-tools",
    name: "Harvesting Tools",
    categoryId: "tools",
    categoryLabel: "Tools",
    price: 750,
    currency: "INR",
    imageUrl: "/products/garden-tools-set.png",
    rating: 4.7,
    reviewCount: 58,
  },
  {
    id: "jute-bags",
    name: "Jute Bags",
    categoryId: "packaging",
    categoryLabel: "Packaging",
    price: 45,
    currency: "INR",
    imageUrl: "/products/garden-tools-set2.png",
    rating: 4.3,
    reviewCount: 29,
  },
  {
    id: "plastic-crates",
    name: "Plastic Crates",
    categoryId: "packaging",
    categoryLabel: "Packaging",
    price: 350,
    currency: "INR",
    imageUrl: "/products/garden-tools-set.png",
    rating: 4.6,
    reviewCount: 47,
  },
];
