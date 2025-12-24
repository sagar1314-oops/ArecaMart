"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function SearchPage() {
  return (
    <div className="container px-4 py-8 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Search Results</h1>
      
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            defaultValue=""
          />
        </div>
        <Button>Search</Button>
      </div>

      <div className="text-center py-12">
        <p className="text-muted-foreground">Enter a search term to find products.</p>
      </div>
    </div>
  )
}
