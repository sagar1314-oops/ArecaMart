"use client"

import { MarketStats } from "./components/MarketStats"
import { TrendCharts } from "./components/TrendCharts"
import { PageHero } from "@/components/PageHero"
import { useSearch } from "@/contexts/SearchContext"

export default function MarketRatesPage() {
  const { searchQuery } = useSearch()
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container px-4 py-8 md:px-6 flex-1">
        <PageHero 
          title="Arecanut Market Prices"
          description="Real-time market data. Connect with buyers and sellers."
          imageSrc="/market_rates_hero.png"
          imageAlt="Arecanut Market Prices"
        />

        {searchQuery && (
          <div className="mb-4 text-sm text-muted-foreground">
            Searching for "{searchQuery}"
          </div>
        )}

        <MarketStats searchQuery={searchQuery} />
        <TrendCharts searchQuery={searchQuery} />
      </div>

    </div>
  )
}
