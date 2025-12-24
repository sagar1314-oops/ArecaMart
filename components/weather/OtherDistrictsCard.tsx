"use client";

import { Cloud, CloudRain, CloudLightning, CloudSun, Sun, Droplets } from "lucide-react";
import { MOCK_WEATHER_DATA } from "@/lib/weather-data";
import { cn } from "@/lib/utils";

const IconMap = {
  Sun: Sun,
  Cloud: Cloud,
  Rain: Droplets,
  CloudRain: CloudRain,
  CloudSun: CloudSun,
  CloudLightning: CloudLightning,
};

interface OtherDistrictsCardProps {
  currentDistrict: string;
  onSelectDistrict: (district: string) => void;
}

export function OtherDistrictsCard({ currentDistrict, onSelectDistrict }: OtherDistrictsCardProps) {
  const otherDistricts = Object.values(MOCK_WEATHER_DATA).filter(d => d.district !== currentDistrict);

  return (
    <div className="bg-card text-card-foreground p-6 rounded-3xl border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Other Districts</h3>
        <button className="text-xs font-medium text-primary hover:underline">See All</button>
      </div>

      <div className="space-y-4">
        {otherDistricts.map((data) => {
            const Icon = IconMap[data.icon] || Cloud;
            
            return (
                <div 
                    key={data.district} 
                    onClick={() => onSelectDistrict(data.district)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-muted p-2 rounded-full group-hover:bg-background transition-colors">
                            <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{data.district}</p>
                            <p className="text-xs text-muted-foreground">{data.condition}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="font-bold">{data.temp}°</span>
                        <span className="text-xs text-muted-foreground ml-1">/ {data.minTemp}°</span>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
}
