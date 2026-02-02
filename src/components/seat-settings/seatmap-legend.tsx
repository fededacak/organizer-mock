"use client";

import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Section, ViewMode, SeatStatus, Hold } from "./types";

// Generate a consistent random color for a given price using a simple hash
function generateColorFromPrice(price: number): string {
  // Use price as seed for consistent colors
  const hue = (price * 137.508) % 360; // Golden angle approximation for good distribution
  const saturation = 65 + (price % 20); // 65-85%
  const lightness = 45 + (price % 15); // 45-60%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Create a color map for all unique prices
export function createPriceColorMap(sections: Section[]): Map<number, string> {
  const prices = new Set<number>();
  for (const section of sections) {
    for (const seat of section.seats) {
      prices.add(seat.price);
    }
  }

  const colorMap = new Map<number, string>();
  for (const price of prices) {
    colorMap.set(price, generateColorFromPrice(price));
  }
  return colorMap;
}

// Get color for a specific price from a color map
export function getPriceColor(
  price: number,
  priceColorMap: Map<number, string>
): string {
  return priceColorMap.get(price) ?? generateColorFromPrice(price);
}

interface SeatmapLegendProps {
  sections: Section[];
  holds: Hold[];
  selectedSeats: Set<string>;
  viewMode: ViewMode;
  priceColorMap: Map<number, string>;
  onSelectSeats: (seatIds: string[], additive?: boolean) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

// Individual legend item button
function LegendItem({
  color,
  label,
  isWhite = false,
  isPasswordProtected = false,
  seatCount,
  onClick,
}: {
  color?: string;
  label: string;
  isWhite?: boolean;
  isPasswordProtected?: boolean;
  seatCount?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-2 cursor-pointer",
        "transition-all duration-200 ease",
        "hover:bg-gray-100 active:bg-gray-200"
      )}
    >
      <div
        className={cn(
          "size-4 rounded-[4px] relative flex items-center justify-center",
          isWhite && "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
        )}
        style={{ backgroundColor: isWhite ? "white" : color }}
      ></div>
      <span className="text-xs font-medium text-foreground">{label}</span>
      {seatCount !== undefined && (
        <span className="text-[10px] text-gray-400">({seatCount})</span>
      )}
    </button>
  );
}

export function SeatmapLegend({
  sections,
  holds,
  selectedSeats,
  viewMode,
  priceColorMap,
  onSelectSeats,
  onViewModeChange,
}: SeatmapLegendProps) {
  // Get all seats matching a specific status
  const getSeatsByStatus = useCallback(
    (status: SeatStatus): string[] => {
      const seatIds: string[] = [];
      for (const section of sections) {
        for (const seat of section.seats) {
          if (seat.status === status) {
            seatIds.push(seat.id);
          }
        }
      }
      return seatIds;
    },
    [sections]
  );

  // Get all seats matching a specific price
  const getSeatsByPrice = useCallback(
    (price: number): string[] => {
      const seatIds: string[] = [];
      for (const section of sections) {
        for (const seat of section.seats) {
          if (seat.price === price) {
            seatIds.push(seat.id);
          }
        }
      }
      return seatIds;
    },
    [sections]
  );

  // Check if all seats in a list are selected
  const areAllSelected = useCallback(
    (seatIds: string[]): boolean => {
      if (seatIds.length === 0) return false;
      return seatIds.every((id) => selectedSeats.has(id));
    },
    [selectedSeats]
  );

  // Handle status legend click
  const handleStatusClick = useCallback(
    (status: SeatStatus) => {
      const matchingSeats = getSeatsByStatus(status);
      if (areAllSelected(matchingSeats)) {
        onSelectSeats([], false);
      } else {
        onSelectSeats(matchingSeats, false);
      }
    },
    [getSeatsByStatus, areAllSelected, onSelectSeats]
  );

  // Handle price legend click
  const handlePriceClick = useCallback(
    (price: number) => {
      const matchingSeats = getSeatsByPrice(price);
      if (areAllSelected(matchingSeats)) {
        onSelectSeats([], false);
      } else {
        onSelectSeats(matchingSeats, false);
      }
    },
    [getSeatsByPrice, areAllSelected, onSelectSeats]
  );

  // Handle hold legend click
  const handleHoldClick = useCallback(
    (hold: Hold) => {
      if (areAllSelected(hold.seatIds)) {
        onSelectSeats([], false);
      } else {
        onSelectSeats(hold.seatIds, false);
      }
    },
    [areAllSelected, onSelectSeats]
  );

  // Get unique prices sorted from low to high with their counts
  const priceData = useMemo(() => {
    const priceCounts = new Map<number, number>();
    for (const section of sections) {
      for (const seat of section.seats) {
        priceCounts.set(seat.price, (priceCounts.get(seat.price) ?? 0) + 1);
      }
    }
    return Array.from(priceCounts.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([price, count]) => ({
        price,
        count,
        color: priceColorMap.get(price) ?? generateColorFromPrice(price),
      }));
  }, [sections, priceColorMap]);

  // Filter holds that have seats
  const activeHolds = useMemo(() => {
    return holds.filter((hold) => hold.seatIds.length > 0);
  }, [holds]);

  // Count seats by status
  const statusCounts = useMemo(() => {
    const counts = { "on-sale": 0, sold: 0, held: 0 };
    for (const section of sections) {
      for (const seat of section.seats) {
        counts[seat.status]++;
      }
    }
    return counts;
  }, [sections]);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 bg-white border border-soft-gray p-2 shadow-floating rounded-[16px] w-[180px]"
      )}
    >
      {/* View Mode Toggle */}
      <div className="flex w-full rounded-[12px] bg-light-gray p-1 border border-transparent">
        <button
          type="button"
          onClick={() => onViewModeChange("status")}
          className={cn(
            "flex-1 h-[28px] px-4 rounded-[8px] text-xs font-semibold transition-all duration-200 ease cursor-pointer",
            viewMode === "status"
              ? "bg-white text-black shadow-sm"
              : "text-gray hover:text-muted-foreground"
          )}
        >
          Status
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange("price")}
          className={cn(
            "flex-1 h-[28px] px-4 rounded-[8px] text-xs font-semibold transition-all duration-200 ease cursor-pointer",
            viewMode === "price"
              ? "bg-white text-black shadow-sm"
              : "text-gray hover:text-muted-foreground"
          )}
        >
          Price
        </button>
      </div>

      <div className="flex flex-col w-full">
        {viewMode === "status" ? (
          <>
            <LegendItem
              label="On Sale"
              isWhite
              seatCount={statusCounts["on-sale"]}
              onClick={() => handleStatusClick("on-sale")}
            />
            <LegendItem
              color="#9ca3af"
              label="Sold"
              seatCount={statusCounts.sold}
              onClick={() => handleStatusClick("sold")}
            />
          </>
        ) : (
          <>
            {priceData.map(({ price, count, color }) => (
              <LegendItem
                key={price}
                color={color}
                label={`$${price}`}
                seatCount={count}
                onClick={() => handlePriceClick(price)}
              />
            ))}
          </>
        )}
      </div>

      {/* Show holds in status view */}
      {viewMode === "status" && activeHolds.length > 0 && (
        <div className="flex flex-wrap flex-col w-full">
          <span className="text-[10px] text-gray-400 mx-2">Holds</span>
          {activeHolds.map((hold) => (
            <LegendItem
              key={hold.id}
              color={hold.color}
              label={hold.name}
              isPasswordProtected={hold.type === "password-protected"}
              seatCount={hold.seatIds.length}
              onClick={() => handleHoldClick(hold)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
