export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: "truck" | "award" | "shield-check" | "headphones";
}

export const featuresData: Feature[] = [
  {
    id: "fast-shipping",
    title: "FAST SHIPPING",
    description: "Quick and reliable delivery for all orders.",
    icon: "truck",
  },
  {
    id: "best-quality-product",
    title: "BEST QUALITY PRODUCT",
    description:
      "Carefully selected inputs and accessories for arecanut farming.",
    icon: "award",
  },
  {
    id: "secure-payment",
    title: "100% SECURE PAYMENT",
    description: "Safe and encrypted online payment options.",
    icon: "shield-check",
  },
  {
    id: "best-service",
    title: "BEST SERVICE",
    description: "Dedicated support to help farmers at every step.",
    icon: "headphones",
  },
];
