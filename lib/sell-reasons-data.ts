export interface SellReason {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SellReasonsData {
  title: string;
  reasons: SellReason[];
}

export const sellReasonsData: SellReasonsData = {
  title: "Why Sell on ArecaMart?",
  reasons: [
    {
      id: "SELL_1",
      title: "Best Market Rates",
      description: "Get competitive prices based on real-time market data.",
      icon: "trending-up",
    },
    {
      id: "SELL_2",
      title: "Direct Buyers",
      description: "Connect directly with verified buyers without middlemen.",
      icon: "users",
    },
    {
      id: "SELL_3",
      title: "Secure Payments",
      description: "Safe and timely payments through verified channels.",
      icon: "shield",
    },
    {
      id: "SELL_4",
      title: "Quick Process",
      description: "List your produce in minutes and start receiving offers.",
      icon: "bolt",
    },
  ],
};
