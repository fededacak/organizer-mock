"use client";

import { cn } from "@/lib/utils";
import type { Seat, ViewMode } from "./types";
import { getPriceColor } from "./seatmap-legend";
import { getSeatStatusColor } from "./seatmap-utils";

export interface SeatButtonProps {
  seat: Seat;
  sectionColor: string;
  sectionPrice: number;
  viewMode: ViewMode;
  priceRange: { min: number; max: number };
  holdColor?: string;
  holdName?: string;
  isSelected: boolean;
  isInLasso: boolean;
  onToggle: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  seatRef: (el: HTMLButtonElement | null) => void;
}

/**
 * Individual seat button component
 * Handles visual representation and interactions for a single seat
 */
export function SeatButton({
  seat,
  sectionColor,
  sectionPrice,
  viewMode,
  priceRange,
  holdColor,
  holdName,
  isSelected,
  isInLasso,
  onToggle,
  onMouseDown,
  onMouseEnter,
  seatRef,
}: SeatButtonProps) {
  const effectivePrice = seat.priceOverride ?? sectionPrice;
  const hasOverride = seat.priceOverride !== undefined;
  const priceLabel = `$${effectivePrice}`;

  // Determine background color based on view mode
  const isPriceView = viewMode === "price";
  const priceColor = isPriceView
    ? getPriceColor(effectivePrice, priceRange.min, priceRange.max)
    : undefined;

  // For status view, use hold color if available
  const statusBgColor =
    !isPriceView && seat.status === "held" && holdColor ? holdColor : undefined;
  const statusClass = getSeatStatusColor(seat.status, holdColor);

  // Build tooltip
  let tooltip = `Row ${seat.row}, Seat ${seat.number} (${seat.status})`;
  if (holdName && seat.status === "held") {
    tooltip = `Row ${seat.row}, Seat ${seat.number} - ${holdName}`;
  }
  tooltip += ` - ${priceLabel}${hasOverride ? " (override)" : ""}`;

  return (
    <button
      ref={seatRef}
      type="button"
      onClick={onToggle}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      className={cn(
        "size-6 rounded-[2px] transition-all duration-150 ease-out cursor-pointer relative",
        !isPriceView && statusClass,
        isSelected && "ring-2 ring-tp-blue ring-offset-1",
        isInLasso && !isSelected && "ring-2 ring-tp-blue/50 ring-offset-1",
        !isSelected && !isInLasso && "hover:ring-2 hover:ring-offset-1",
      )}
      style={{
        backgroundColor: isPriceView ? priceColor : statusBgColor,
        boxShadow:
          !isSelected && !isInLasso
            ? `0 0 0 0.5px ${sectionColor}50`
            : undefined,
      }}
      title={tooltip}
      data-seat-id={seat.id}
    />
  );
}
