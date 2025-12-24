"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HighlightText } from "@/components/HighlightText";
import { useState } from "react";
import {
  last7DaysChartData,
  ytdChartData,
  thisMonthChartData,
  prevMonthChartData,
} from "@/lib/trend-chart-data";

// Last 7 Days data - transformed from JSON
const last7DaysData = last7DaysChartData.data.map((item) => ({
  day: item.date,
  ...item,
}));

// Market-wise Year-to-Date Average by Month - transformed from JSON
const ytdData = [...ytdChartData.data];

// Market-wise This Month Average - transformed from JSON
const thisMonthData = thisMonthChartData.data.map((item) => ({
  day: item.date,
  ...item,
}));

// Market-wise Previous Month Average - transformed from JSON
const prevMonthData = prevMonthChartData.data.map((item) => ({
  day: item.date,
  ...item,
}));

interface TrendChartsProps {
  searchQuery?: string;
}

export function TrendCharts({ searchQuery = "" }: TrendChartsProps) {
  // State for Last 7 Days chart
  const [visibleMarkets, setVisibleMarkets] = useState({
    Badravati: true,
    Kadur: true,
    Haveri: true,
    Davanagere: true,
    Chennagiri: true,
  });

  // State for YTD chart
  const [visibleMarketsYTD, setVisibleMarketsYTD] = useState({
    Badravati: true,
    Kadur: true,
    Haveri: true,
    Davanagere: true,
    Chennagiri: true,
  });

  // State for This Month chart
  const [visibleMarketsThisMonth, setVisibleMarketsThisMonth] = useState({
    Badravati: true,
    Kadur: true,
    Haveri: true,
    Davanagere: true,
    Chennagiri: true,
  });

  // State for Previous Month chart
  const [visibleMarketsPrevMonth, setVisibleMarketsPrevMonth] = useState({
    Badravati: true,
    Kadur: true,
    Haveri: true,
    Davanagere: true,
    Chennagiri: true,
  });

  const toggleMarket = (market: keyof typeof visibleMarkets) => {
    setVisibleMarkets((prev) => ({
      ...prev,
      [market]: !prev[market],
    }));
  };

  const toggleMarketYTD = (market: keyof typeof visibleMarketsYTD) => {
    setVisibleMarketsYTD((prev) => ({
      ...prev,
      [market]: !prev[market],
    }));
  };

  const toggleMarketThisMonth = (
    market: keyof typeof visibleMarketsThisMonth
  ) => {
    setVisibleMarketsThisMonth((prev) => ({
      ...prev,
      [market]: !prev[market],
    }));
  };

  const toggleMarketPrevMonth = (
    market: keyof typeof visibleMarketsPrevMonth
  ) => {
    setVisibleMarketsPrevMonth((prev) => ({
      ...prev,
      [market]: !prev[market],
    }));
  };

  const charts = [
    {
      title: last7DaysChartData.title,
      content: (
        <>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                  domain={[0, "auto"]}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #ccc",
                  }}
                />
                {visibleMarkets.Badravati && (
                  <Line
                    type="monotone"
                    dataKey="Badravati"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                )}
                {visibleMarkets.Kadur && (
                  <Line
                    type="monotone"
                    dataKey="Kadur"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                )}
                {visibleMarkets.Haveri && (
                  <Line
                    type="monotone"
                    dataKey="Haveri"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                )}
                {visibleMarkets.Davanagere && (
                  <Line
                    type="monotone"
                    dataKey="Davanagere"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                )}
                {visibleMarkets.Chennagiri && (
                  <Line
                    type="monotone"
                    dataKey="Chennagiri"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={() => toggleMarket("Badravati")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarkets.Badravati
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-0.5 bg-green-500 mr-2 ${
                  !visibleMarkets.Badravati && "opacity-30"
                }`}
              ></span>
              Badravati
            </button>
            <button
              onClick={() => toggleMarket("Kadur")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarkets.Kadur
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-0.5 bg-blue-500 mr-2 ${
                  !visibleMarkets.Kadur && "opacity-30"
                }`}
              ></span>
              Kadur
            </button>
            <button
              onClick={() => toggleMarket("Haveri")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarkets.Haveri
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-0.5 bg-purple-500 mr-2 ${
                  !visibleMarkets.Haveri && "opacity-30"
                }`}
              ></span>
              Haveri
            </button>
            <button
              onClick={() => toggleMarket("Davanagere")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarkets.Davanagere
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-0.5 bg-amber-500 mr-2 ${
                  !visibleMarkets.Davanagere && "opacity-30"
                }`}
              ></span>
              Davanagere
            </button>
            <button
              onClick={() => toggleMarket("Chennagiri")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarkets.Chennagiri
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-0.5 bg-red-500 mr-2 ${
                  !visibleMarkets.Chennagiri && "opacity-30"
                }`}
              ></span>
              Chennagiri
            </button>
          </div>
        </>
      ),
    },
    {
      title: ytdChartData.title,
      content: (
        <>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ytdData}>
                <defs>
                  <linearGradient
                    id="colorBadravati"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="colorKadur" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="colorHaveri" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient
                    id="colorDavanagere"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient
                    id="colorChennagiri"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                  domain={[0, "auto"]}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #ccc",
                  }}
                />
                {visibleMarketsYTD.Badravati && (
                  <Area
                    type="monotone"
                    dataKey="Badravati"
                    stroke="#22c55e"
                    fill="url(#colorBadravati)"
                    fillOpacity={0.6}
                  />
                )}
                {visibleMarketsYTD.Kadur && (
                  <Area
                    type="monotone"
                    dataKey="Kadur"
                    stroke="#3b82f6"
                    fill="url(#colorKadur)"
                    fillOpacity={0.6}
                  />
                )}
                {visibleMarketsYTD.Haveri && (
                  <Area
                    type="monotone"
                    dataKey="Haveri"
                    stroke="#8b5cf6"
                    fill="url(#colorHaveri)"
                    fillOpacity={0.6}
                  />
                )}
                {visibleMarketsYTD.Davanagere && (
                  <Area
                    type="monotone"
                    dataKey="Davanagere"
                    stroke="#f59e0b"
                    fill="url(#colorDavanagere)"
                    fillOpacity={0.6}
                  />
                )}
                {visibleMarketsYTD.Chennagiri && (
                  <Area
                    type="monotone"
                    dataKey="Chennagiri"
                    stroke="#ef4444"
                    fill="url(#colorChennagiri)"
                    fillOpacity={0.6}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={() => toggleMarketYTD("Badravati")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsYTD.Badravati
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-2 bg-green-500 mr-2 rounded-sm ${
                  !visibleMarketsYTD.Badravati && "opacity-30"
                }`}
              ></span>
              Badravati
            </button>
            <button
              onClick={() => toggleMarketYTD("Kadur")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsYTD.Kadur
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-2 bg-blue-500 mr-2 rounded-sm ${
                  !visibleMarketsYTD.Kadur && "opacity-30"
                }`}
              ></span>
              Kadur
            </button>
            <button
              onClick={() => toggleMarketYTD("Haveri")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsYTD.Haveri
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-2 bg-purple-500 mr-2 rounded-sm ${
                  !visibleMarketsYTD.Haveri && "opacity-30"
                }`}
              ></span>
              Haveri
            </button>
            <button
              onClick={() => toggleMarketYTD("Davanagere")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsYTD.Davanagere
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-2 bg-amber-500 mr-2 rounded-sm ${
                  !visibleMarketsYTD.Davanagere && "opacity-30"
                }`}
              ></span>
              Davanagere
            </button>
            <button
              onClick={() => toggleMarketYTD("Chennagiri")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsYTD.Chennagiri
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-2 bg-red-500 mr-2 rounded-sm ${
                  !visibleMarketsYTD.Chennagiri && "opacity-30"
                }`}
              ></span>
              Chennagiri
            </button>
          </div>
        </>
      ),
    },
    {
      title: thisMonthChartData.title,
      content: (
        <>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={thisMonthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#888" }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                  domain={[0, "auto"]}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #ccc",
                  }}
                />
                {visibleMarketsThisMonth.Badravati && (
                  <Line
                    type="monotone"
                    dataKey="Badravati"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#22c55e",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 7 }}
                  />
                )}
                {visibleMarketsThisMonth.Kadur && (
                  <Line
                    type="monotone"
                    dataKey="Kadur"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#3b82f6",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 7 }}
                  />
                )}
                {visibleMarketsThisMonth.Haveri && (
                  <Line
                    type="monotone"
                    dataKey="Haveri"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#8b5cf6",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 7 }}
                  />
                )}
                {visibleMarketsThisMonth.Davanagere && (
                  <Line
                    type="monotone"
                    dataKey="Davanagere"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#f59e0b",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 7 }}
                  />
                )}
                {visibleMarketsThisMonth.Chennagiri && (
                  <Line
                    type="monotone"
                    dataKey="Chennagiri"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#ef4444",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 7 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={() => toggleMarketThisMonth("Badravati")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsThisMonth.Badravati
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-1 bg-green-500 mr-2 rounded-full ${
                  !visibleMarketsThisMonth.Badravati && "opacity-30"
                }`}
              ></span>
              Badravati
            </button>
            <button
              onClick={() => toggleMarketThisMonth("Kadur")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsThisMonth.Kadur
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-1 bg-blue-500 mr-2 rounded-full ${
                  !visibleMarketsThisMonth.Kadur && "opacity-30"
                }`}
              ></span>
              Kadur
            </button>
            <button
              onClick={() => toggleMarketThisMonth("Haveri")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsThisMonth.Haveri
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-1 bg-purple-500 mr-2 rounded-full ${
                  !visibleMarketsThisMonth.Haveri && "opacity-30"
                }`}
              ></span>
              Haveri
            </button>
            <button
              onClick={() => toggleMarketThisMonth("Davanagere")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsThisMonth.Davanagere
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-1 bg-amber-500 mr-2 rounded-full ${
                  !visibleMarketsThisMonth.Davanagere && "opacity-30"
                }`}
              ></span>
              Davanagere
            </button>
            <button
              onClick={() => toggleMarketThisMonth("Chennagiri")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsThisMonth.Chennagiri
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-1 bg-red-500 mr-2 rounded-full ${
                  !visibleMarketsThisMonth.Chennagiri && "opacity-30"
                }`}
              ></span>
              Chennagiri
            </button>
          </div>
        </>
      ),
    },
    {
      title: "Previous Month Analysis",
      content: (
        <>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prevMonthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#888" }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                  domain={[0, "auto"]}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #ccc",
                  }}
                />
                {visibleMarketsPrevMonth.Badravati && (
                  <Line
                    type="monotone"
                    dataKey="Badravati"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#22c55e",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 7 }}
                  />
                )}
                {visibleMarketsPrevMonth.Kadur && (
                  <Line
                    type="monotone"
                    dataKey="Kadur"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#3b82f6",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 7 }}
                  />
                )}
                {visibleMarketsPrevMonth.Haveri && (
                  <Line
                    type="monotone"
                    dataKey="Haveri"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#8b5cf6",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 7 }}
                  />
                )}
                {visibleMarketsPrevMonth.Davanagere && (
                  <Line
                    type="monotone"
                    dataKey="Davanagere"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#f59e0b",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 7 }}
                  />
                )}
                {visibleMarketsPrevMonth.Chennagiri && (
                  <Line
                    type="monotone"
                    dataKey="Chennagiri"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#ef4444",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 7 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={() => toggleMarketPrevMonth("Badravati")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsPrevMonth.Badravati
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-1 bg-green-500 mr-2 rounded-full ${
                  !visibleMarketsPrevMonth.Badravati && "opacity-30"
                }`}
              ></span>
              Badravati
            </button>
            <button
              onClick={() => toggleMarketPrevMonth("Kadur")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsPrevMonth.Kadur
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-1 bg-blue-500 mr-2 rounded-full ${
                  !visibleMarketsPrevMonth.Kadur && "opacity-30"
                }`}
              ></span>
              Kadur
            </button>
            <button
              onClick={() => toggleMarketPrevMonth("Haveri")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsPrevMonth.Haveri
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-1 bg-purple-500 mr-2 rounded-full ${
                  !visibleMarketsPrevMonth.Haveri && "opacity-30"
                }`}
              ></span>
              Haveri
            </button>
            <button
              onClick={() => toggleMarketPrevMonth("Davanagere")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsPrevMonth.Davanagere
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-1 bg-amber-500 mr-2 rounded-full ${
                  !visibleMarketsPrevMonth.Davanagere && "opacity-30"
                }`}
              ></span>
              Davanagere
            </button>
            <button
              onClick={() => toggleMarketPrevMonth("Chennagiri")}
              className={`flex items-center text-sm transition-opacity ${
                visibleMarketsPrevMonth.Chennagiri
                  ? "text-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <span
                className={`w-3 h-1 bg-red-500 mr-2 rounded-full ${
                  !visibleMarketsPrevMonth.Chennagiri && "opacity-30"
                }`}
              ></span>
              Chennagiri
            </button>
          </div>
        </>
      ),
    },
  ];

  const filteredCharts = charts.filter((chart) =>
    searchQuery
      ? chart.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {filteredCharts.map((chart, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              <HighlightText text={chart.title} highlight={searchQuery} />
            </CardTitle>
          </CardHeader>
          <CardContent>{chart.content}</CardContent>
        </Card>
      ))}
    </div>
  );
}
