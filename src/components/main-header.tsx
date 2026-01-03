"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { TickPickLogo } from "./tickpick-logo";

type TabValue = "buy" | "sell" | "create";

interface MainHeaderProps {
  activeTab?: TabValue;
  onTabChange?: (tab: TabValue) => void;
}

export function MainHeader({
  activeTab = "buy",
  onTabChange,
}: MainHeaderProps) {
  const tabs: { value: TabValue; label: string }[] = [
    { value: "buy", label: "Buy" },
    { value: "sell", label: "Sell" },
    { value: "create", label: "Create" },
  ];

  return (
    <header className="flex items-center justify-between px-[160px] py-4 h-20 bg-white">
      {/* Logo */}
      <Link href="/" className="shrink-0">
        <TickPickLogo width={180} height={40} variant="dark" />
      </Link>

      {/* Tab Navigation */}
      <nav className="absolute left-1/2 -translate-x-1/2 bg-[#f3f4f6] p-2 rounded-full">
        <div className="relative flex items-center">
          {/* Active Tab Background Indicator */}
          <div
            className="absolute h-11 w-24 bg-black rounded-full transition-transform duration-200 ease-out will-change-transform"
            style={{
              transform: `translateX(${tabs.findIndex((t) => t.value === activeTab) * 96}px)`,
            }}
          />

          {/* Tabs */}
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange?.(tab.value)}
              className={`
                relative z-10 w-24 h-11 flex items-center justify-center
                font-outfit font-semibold text-sm rounded-full
                transition-colors duration-200 ease
                ${
                  activeTab === tab.value
                    ? "text-white"
                    : "text-[#334155] hover:text-black"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Account Button */}
      <button className="flex items-center gap-2 bg-[#f7f7f7] rounded-full px-3 py-2 transition-colors duration-200 ease hover:bg-[#eeeeee]">
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          <Image
            src="/organizer-avatar.jpg"
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <ChevronDown className="w-4 h-4 text-[#334155]" />
      </button>
    </header>
  );
}

