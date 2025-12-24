export const SELLER_PLANS = {
  TRIAL: {
    id: "trial",
    name: "Free Trial",
    price: 0,
    duration: "7 days",
    features: ["Basic listings", "Limited duration"],
    durationInDays: 7,
  },
  MONTHLY: {
    id: "1m",
    name: "Monthly Plan",
    price: 199,
    duration: "1 month",
    features: ["Standard listings", "Email support"],
    durationInDays: 30,
  },
  SIX_MONTHS: {
    id: "6m",
    name: "Half-Yearly Plan",
    price: 999,
    duration: "6 months",
    features: ["Priority listings", "Phone support", "Analytics"],
    durationInDays: 180,
  },
  YEARLY: {
    id: "1y",
    name: "Yearly Plan",
    price: 1799,
    duration: "1 year",
    features: ["All Premium features", "Dedicated manager", "Zero fees"],
    durationInDays: 365,
  },
} as const;

export type SellerPlanId = keyof typeof SELLER_PLANS;

export function getPlanDetails(planId: string) {
  return Object.values(SELLER_PLANS).find((p) => p.id === planId);
}
