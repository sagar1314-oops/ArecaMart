"use client";

import { useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSun,
  Sun,
  Droplets,
} from "lucide-react";
import { MOCK_FORECAST, DayForecast } from "@/lib/weather-data";
import { cn } from "@/lib/utils";

const IconMap = {
  Sun: Sun,
  Cloud: Cloud,
  Rain: Droplets,
  CloudRain: CloudRain,
  CloudSun: CloudSun,
  CloudLightning: CloudLightning,
};

export function ForecastComponent() {
  const [mode, setMode] = useState<"Temp" | "Rain">("Temp");

  return (
    <div className="bg-card text-card-foreground p-6 rounded-3xl border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">10 Day Forecast</h3>
        <div className="bg-muted rounded-full p-1 flex text-xs font-medium">
          <button
            onClick={() => setMode("Temp")}
            className={cn(
              "px-4 py-1.5 rounded-full transition-all",
              mode === "Temp"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Temp
          </button>
          <button
            onClick={() => setMode("Rain")}
            className={cn(
              "px-4 py-1.5 rounded-full transition-all",
              mode === "Rain"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Rain %
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
        {MOCK_FORECAST.map((day, idx) => {
          const Icon = IconMap[day.icon] || Cloud;
          // Determine rain risk color for bar
          const rainRiskColor =
            day.rainChance > 60
              ? "bg-red-500"
              : day.rainChance > 30
              ? "bg-yellow-500"
              : "bg-green-500";

          return (
            <div
              key={idx}
              className="flex-shrink-0 flex flex-col items-center justify-between w-20 p-3 rounded-2xl hover:bg-muted/30 transition-colors group"
            >
              <span className="text-xs font-medium text-muted-foreground mb-3">
                {day.day}
              </span>
              <Icon className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />

              {mode === "Temp" ? (
                <span className="font-bold">{day.temp}°C</span>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <span className="text-xs font-bold mb-1">
                    {day.rainChance}%
                  </span>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", rainRiskColor)}
                      style={{ width: `${day.rainChance}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
