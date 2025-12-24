"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
} from "lucide-react";
import { HighlightText } from "@/components/HighlightText";
import { marketData } from "@/lib/market-json-data";

interface MarketStatsProps {
  searchQuery?: string;
}

export function MarketStats({ searchQuery = "" }: MarketStatsProps) {
  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  };

  const calculateTrend = (current: number, previous: number, label: string) => {
    const diff = current - previous;
    const percentage = ((diff / previous) * 100).toFixed(1);
    const isPositive = diff > 0;
    const isNeutral = diff === 0;

    return {
      change: `${isPositive ? "+" : ""}${percentage}% from ${label}`,
      trend: isPositive ? "up" : isNeutral ? "neutral" : "down",
      text: isPositive
        ? "text-green-700 dark:text-green-400"
        : isNeutral
        ? "text-gray-700 dark:text-gray-400"
        : "text-red-700 dark:text-red-400",
      bg: isPositive
        ? "bg-green-100 dark:bg-green-900/20"
        : isNeutral
        ? "bg-gray-100 dark:bg-gray-800/20"
        : "bg-red-100 dark:bg-red-900/20",
      icon: isPositive ? TrendingUp : isNeutral ? Activity : TrendingDown,
    };
  };

  const stats = marketData.Columns.filter((col) => col.Hide === "false")
    .sort((a, b) => a.SortingID - b.SortingID)
    .map((col) => {
      const currentPriceStr =
        marketData.data[0][col.ColumnName as keyof (typeof marketData.data)[0]];
      const currentPrice = parsePrice(currentPriceStr);

      let previousPriceStr = "";
      let label = "";

      switch (col.ColumnName) {
        case "todaysPrice":
          previousPriceStr = marketData.data[0].yesterdaysPrice;
          label = "yesterday";
          break;
        case "yesterdaysPrice":
          previousPriceStr = marketData.data[0].dayBeforeYesterdaysPrice;
          label = "day before";
          break;
        case "weeklyAvgPrice":
          previousPriceStr = marketData.data[0].lastWeeklyAvgPrice;
          label = "last week";
          break;
        case "monthlyAvgPrice":
          previousPriceStr = marketData.data[0].lastMonthlyAvgPrice;
          label = "last month";
          break;
        default:
          previousPriceStr = currentPriceStr;
          label = "previous";
      }

      const previousPrice = parsePrice(previousPriceStr);
      const trendData = calculateTrend(currentPrice, previousPrice, label);

      return {
        title: col.HeaderName,
        price: `${currentPriceStr}/quinto`,
        ...trendData,
      };
    });

  const filteredStats = stats.filter((stat) =>
    searchQuery
      ? stat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stat.change.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {filteredStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`${stat.bg} border shadow-sm relative overflow-hidden`}
          >
            <CardContent className="p-6">
              <div className="absolute top-4 right-4 p-2 bg-white/50 dark:bg-black/10 rounded-full">
                <Icon className={`h-6 w-6 ${stat.text}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground mb-1">
                  <HighlightText text={stat.title} highlight={searchQuery} />
                </span>
                <span className={`text-3xl font-bold ${stat.text}`}>
                  {stat.price}
                </span>
                <div className={`flex items-center mt-2 text-sm ${stat.text}`}>
                  {stat.trend === "up" ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  <span>
                    <HighlightText text={stat.change} highlight={searchQuery} />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
