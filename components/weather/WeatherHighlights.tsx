"use client";

import { Wind, Droplets, Sunrise, Sunset, Eye, Sun } from "lucide-react";
import { WeatherData } from "@/lib/weather-data";
import { cn } from "@/lib/utils";

interface HighlightTileProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
}

function HighlightTile({ label, value, subtext, icon }: HighlightTileProps) {
  return (
    <div className="bg-muted/30 p-4 rounded-2xl flex flex-col justify-between h-32 hover:bg-muted/50 transition-colors">
      <div className="flex justify-between items-start text-muted-foreground">
        <span className="text-sm font-medium">{label}</span>
        <div className="p-1.5 bg-background rounded-full shadow-sm">{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        {subtext && (
          <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
        )}
      </div>
    </div>
  );
}

export function WeatherHighlights({ data }: { data: WeatherData }) {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-3xl border shadow-sm">
      <h3 className="text-lg font-bold mb-4">Today&apos;s Highlight</h3>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <HighlightTile
          label="Wind Status"
          value={`${data.windSpeed} km/h`}
          subtext="9:00 AM"
          icon={<Wind className="h-4 w-4" />}
        />
        <HighlightTile
          label="Humidity"
          value={`${data.humidity}%`}
          subtext="Humidity is high"
          icon={<Droplets className="h-4 w-4" />}
        />
        <HighlightTile
          label="Sunrise"
          value={data.sunrise}
          icon={<Sunrise className="h-4 w-4 text-orange-500" />}
        />
        <HighlightTile
          label="Sunset"
          value={data.sunset}
          icon={<Sunset className="h-4 w-4 text-orange-500" />}
        />
        <HighlightTile
          label="UV Index"
          value={`${data.uvIndex} UV`}
          subtext="Moderate UV"
          icon={<Sun className="h-4 w-4 text-yellow-500" />}
        />
        <HighlightTile
          label="Visibility"
          value={`${data.visibility} km`}
          subtext="9:00 AM"
          icon={<Eye className="h-4 w-4" />}
        />
      </div>

      <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl">
        <p className="text-xs text-yellow-800 dark:text-yellow-200">
          <strong>Farmer Hint:</strong> Avoid spraying between 11 AM–2 PM (high
          UV & heat).
        </p>
      </div>
    </div>
  );
}
