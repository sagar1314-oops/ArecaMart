"use client";

import {
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSun,
  Sun,
  Wind,
  Droplets,
} from "lucide-react";
import { WeatherData } from "@/lib/weather-data";
import { cn } from "@/lib/utils";

const IconMap = {
  Sun: Sun,
  Cloud: Cloud,
  Rain: Droplets,
  CloudRain: CloudRain,
  CloudSun: CloudSun,
  CloudLightning: CloudLightning,
};

interface CurrentWeatherCardProps {
  data: WeatherData;
  isGuest: boolean;
  userName?: string;
  className?: string;
}

export function CurrentWeatherCard({
  data,
  isGuest,
  userName,
  className,
}: CurrentWeatherCardProps) {
  const Icon = IconMap[data.icon] || Cloud;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const date = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "bg-card text-card-foreground p-6 rounded-3xl border shadow-sm relative overflow-hidden",
        className
      )}
    >
      {/* Background Gradient Blob simulation */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {isGuest ? data.district : `My Farm · ${data.district}`}
        </div>
        <div className="bg-muted/50 rounded-full px-3 py-1 text-xs font-bold">
          °C
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
        <div>
          <h2 className="text-4xl font-bold mb-1">{today}</h2>
          <p className="text-muted-foreground mb-6">{date}</p>
        </div>
        <div className="flex flex-col items-center">
          <Icon className="h-24 w-24 text-primary mb-2 drop-shadow-md" />
          <div className="text-center">
            <span className="text-5xl font-bold tracking-tighter">
              {data.temp}°C
            </span>
            <span className="text-2xl text-muted-foreground ml-2">
              / {data.minTemp}°C
            </span>
          </div>
          <p className="text-lg font-medium mt-1">{data.condition}</p>
          <p className="text-sm text-muted-foreground">
            Feels like {data.feelsLike}°C
          </p>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="inline-block p-1 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-300">
            <Wind className="h-3 w-3" />
          </span>
          Best time for field work today:{" "}
          <span className="font-medium text-foreground">
            6–10 AM (cooler, low wind)
          </span>
        </p>
      </div>
    </div>
  );
}
