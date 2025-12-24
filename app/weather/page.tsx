"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Search, Moon, Sun as SunIcon } from "lucide-react";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { WeatherHighlights } from "@/components/weather/WeatherHighlights";
import { OtherDistrictsCard } from "@/components/weather/OtherDistrictsCard";
import { ForecastComponent } from "@/components/weather/ForecastComponent";
import { MOCK_WEATHER_DATA } from "@/lib/weather-data";

export default function WeatherPage() {
  const { data: session } = useSession();
  const [selectedDistrict, setSelectedDistrict] = useState("Chitradurga");
  const [greeting, setGreeting] = useState("Good Morning");

  // Determine greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Use user address if logged in, else default
  // Note: user.address is not strictly typed in session, so we check securely
  useEffect(() => {
    const userAddress = (session?.user as any)?.address;
    if (userAddress) {
      // Simple logic to check if known district is in address string
      if (userAddress.includes("Davangere")) setSelectedDistrict("Davangere");
      else if (userAddress.includes("Shivamogga"))
        setSelectedDistrict("Shivamogga");
      // Default fallback to Chitradurga if matches nothing but is logged in
    }
  }, [session]);

  const currentData =
    MOCK_WEATHER_DATA[selectedDistrict] || MOCK_WEATHER_DATA["Chitradurga"];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Header Section */}
      <div className="bg-background border-b px-8 py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Hi, {session?.user?.name || "Farmer"}
            </p>
            <h1 className="text-2xl font-bold">{greeting}</h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search your location (e.g. Chitradurga)"
              className="w-full bg-muted/50 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              // Mock search - just for visual fidelity
            />
          </div>

          <div className="hidden md:flex gap-2">
            {/* Theme toggle effectively handled by Navbar, so this area is clean or for profile avatar */}
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold">
              {session?.user?.name?.[0] || "F"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column: Current Weather & Districts */}
          <div className="xl:col-span-1 space-y-6">
            <CurrentWeatherCard
              data={currentData}
              isGuest={!session}
              userName={session?.user?.name || undefined}
              className="h-[400px]"
            />

            <OtherDistrictsCard
              currentDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrict}
            />
          </div>

          {/* Right Column: Highlights & Forecast */}
          <div className="xl:col-span-2 space-y-6">
            <WeatherHighlights data={currentData} />

            <ForecastComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
