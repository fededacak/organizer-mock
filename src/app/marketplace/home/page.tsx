"use client";

import { useState } from "react";
import { MainHeader } from "@/components/main-header";
import { SearchBar } from "@/components/search-bar";

export default function MarketplaceHomePage() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell" | "create">("buy");

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Handle search logic here
  };

  return (
    <div className="min-h-screen bg-white">
      <MainHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Hero Section */}
      <main className="px-[160px] pt-12 pb-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-outfit text-5xl font-black text-black">
            Fans Know
          </h1>
          <p className="mt-1 text-lg text-[#334155]">
            The best memories start with the best prices.
          </p>

          {/* Search Bar */}
          <div className="mt-8 w-full flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </main>
    </div>
  );
}
