"use client";

import { cn } from "@/lib/utils";
import type { Seat, ViewMode } from "./types";
import { getPriceColor } from "./seatmap-legend";
import { getSeatStatusColor } from "./seatmap-utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export interface SeatButtonProps {
  seat: Seat;
  sectionColor: string;
  viewMode: ViewMode;
  priceColorMap: Map<number, string>;
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
  viewMode,
  priceColorMap,
  holdColor,
  holdName,
  isSelected,
  isInLasso,
  onToggle,
  onMouseDown,
  onMouseEnter,
  seatRef,
}: SeatButtonProps) {
  const priceLabel = `$${seat.price}`;

  // Determine background color based on view mode
  const isPriceView = viewMode === "price";
  const priceColor = isPriceView
    ? getPriceColor(seat.price, priceColorMap)
    : undefined;

  // For status view, use hold color if available
  const statusBgColor =
    !isPriceView && seat.status === "held" && holdColor ? holdColor : undefined;
  const statusClass = getSeatStatusColor(seat.status, holdColor);

  // Build tooltip
  let tooltip = `Row ${seat.row}, Seat ${seat.number}`;
  if (holdName && seat.status === "held") {
    tooltip += ` - ${holdName}`;
  }
  tooltip += ` - ${priceLabel}`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
            !isSelected && !isInLasso && "hover:ring-2 hover:ring-offset-1"
          )}
          style={{
            backgroundColor: isPriceView ? priceColor : statusBgColor,
            boxShadow:
              !isSelected && !isInLasso
                ? `0 0 0 0.5px ${sectionColor}50`
                : undefined,
          }}
          data-seat-id={seat.id}
        />
      </TooltipTrigger>
      <TooltipContent className="bg-gray-900 text-white border-none">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
