"use client";

import { useCallback, useMemo } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Section, ViewMode, SeatStatus, Hold } from "./types";

// Price tier colors (low to high)
export const PRICE_COLORS = [
  { color: "#10B981", label: "Lowest" }, // Green
  { color: "#84CC16", label: "Low" }, // Lime
  { color: "#F59E0B", label: "Medium" }, // Amber
  { color: "#EF4444", label: "High" }, // Red
];

// Get price color based on price relative to min/max
export function getPriceColor(
  price: number,
  minPrice: number,
  maxPrice: number,
): string {
  if (minPrice === maxPrice) return PRICE_COLORS[1].color;
  const ratio = (price - minPrice) / (maxPrice - minPrice);
  const index = Math.min(
    Math.floor(ratio * PRICE_COLORS.length),
    PRICE_COLORS.length - 1,
  );
  return PRICE_COLORS[index].color;
}

// Get price tier index (0-3) based on price relative to min/max
export function getPriceTierIndex(
  price: number,
  minPrice: number,
  maxPrice: number,
): number {
  if (minPrice === maxPrice) return 1;
  const ratio = (price - minPrice) / (maxPrice - minPrice);
  return Math.min(
    Math.floor(ratio * PRICE_COLORS.length),
    PRICE_COLORS.length - 1,
  );
}

interface SeatmapLegendProps {
  sections: Section[];
  holds: Hold[];
  selectedSeats: Set<string>;
  viewMode: ViewMode;
  priceRange: { min: number; max: number };
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
        "hover:bg-gray-100 active:bg-gray-200",
      )}
    >
      <div
        className={cn(
          "size-4 rounded-[4px] relative flex items-center justify-center",
          isWhite && "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
        )}
        style={{ backgroundColor: isWhite ? "white" : color }}
      >
      </div>
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
  priceRange,
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
    [sections],
  );

  // Get all seats matching a specific price tier
  const getSeatsByPriceTier = useCallback(
    (tierIndex: number): string[] => {
      const seatIds: string[] = [];
      for (const section of sections) {
        for (const seat of section.seats) {
          const effectivePrice = seat.priceOverride ?? section.price;
          const seatTierIndex = getPriceTierIndex(
            effectivePrice,
            priceRange.min,
            priceRange.max,
          );
          if (seatTierIndex === tierIndex) {
            seatIds.push(seat.id);
          }
        }
      }
      return seatIds;
    },
    [sections, priceRange],
  );

  // Check if all seats in a list are selected
  const areAllSelected = useCallback(
    (seatIds: string[]): boolean => {
      if (seatIds.length === 0) return false;
      return seatIds.every((id) => selectedSeats.has(id));
    },
    [selectedSeats],
  );

  // Handle status legend click
  const handleStatusClick = useCallback(
    (status: SeatStatus) => {
      const matchingSeats = getSeatsByStatus(status);
      if (areAllSelected(matchingSeats)) {
        // Toggle off - clear selection
        onSelectSeats([], false);
      } else {
        // Select all matching
        onSelectSeats(matchingSeats, false);
      }
    },
    [getSeatsByStatus, areAllSelected, onSelectSeats],
  );

  // Handle price tier legend click
  const handlePriceTierClick = useCallback(
    (tierIndex: number) => {
      const matchingSeats = getSeatsByPriceTier(tierIndex);
      if (areAllSelected(matchingSeats)) {
        // Toggle off - clear selection
        onSelectSeats([], false);
      } else {
        // Select all matching
        onSelectSeats(matchingSeats, false);
      }
    },
    [getSeatsByPriceTier, areAllSelected, onSelectSeats],
  );

  // Handle hold legend click
  const handleHoldClick = useCallback(
    (hold: Hold) => {
      if (areAllSelected(hold.seatIds)) {
        // Toggle off - clear selection
        onSelectSeats([], false);
      } else {
        // Select all seats in this hold
        onSelectSeats(hold.seatIds, false);
      }
    },
    [areAllSelected, onSelectSeats],
  );

  // Memoize price tier labels with actual prices
  const priceTierLabels = useMemo(() => {
    const { min, max } = priceRange;
    const step = (max - min) / (PRICE_COLORS.length - 1);

    return PRICE_COLORS.map((_, index) => {
      const price = Math.round(min + step * index);
      return `$${price}`;
    });
  }, [priceRange]);

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

  // Count seats by price tier
  const priceTierCounts = useMemo(() => {
    const counts = PRICE_COLORS.map(() => 0);
    for (const section of sections) {
      for (const seat of section.seats) {
        const effectivePrice = seat.priceOverride ?? section.price;
        const tierIndex = getPriceTierIndex(
          effectivePrice,
          priceRange.min,
          priceRange.max,
        );
        counts[tierIndex]++;
      }
    }
    return counts;
  }, [sections, priceRange]);

  // Check if we have multiple rows (holds visible in status view)
  const hasMultipleRows = viewMode === "status" && activeHolds.length > 0;

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
              : "text-gray hover:text-muted-foreground",
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
              : "text-gray hover:text-muted-foreground",
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
            {activeHolds.length === 0 && (
              <LegendItem
                color="#f87171"
                label="Held"
                seatCount={statusCounts.held}
                onClick={() => handleStatusClick("held")}
              />
            )}
          </>
        ) : (
          <>
            {PRICE_COLORS.map((tier, index) => (
              <LegendItem
                key={tier.label}
                color={tier.color}
                label={priceTierLabels[index]}
                seatCount={priceTierCounts[index]}
                onClick={() => handlePriceTierClick(index)}
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
