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

export interface TableSeatButtonProps {
  seat: Seat;
  tableName: string;
  tableColor: string;
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
  // Position around the table
  angle: number;
  radius: number;
}

/**
 * Circular seat button for table layouts
 * Positioned absolutely around a round table using angle and radius
 */
export function TableSeatButton({
  seat,
  tableName,
  tableColor,
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
  angle,
  radius,
}: TableSeatButtonProps) {
  const priceLabel = `$${seat.price}`;

  // Calculate position from angle and radius
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  // Determine background color based on view mode
  const isPriceView = viewMode === "price";
  const priceColor = isPriceView
    ? getPriceColor(seat.price, priceColorMap)
    : undefined;

  // For status view, use hold color if available
  const statusBgColor =
    !isPriceView && seat.status === "held" && holdColor ? holdColor : undefined;
  const statusClass = getSeatStatusColor(seat.status, holdColor);

  // Build tooltip - show as "Table X, Seat Y"
  let tooltip = `${tableName}, Seat ${seat.number}`;
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
            "absolute size-6 rounded-full transition-all duration-150 ease-out cursor-pointer",
            !isPriceView && statusClass,
            isSelected && "ring-2 ring-tp-blue ring-offset-1",
            isInLasso && !isSelected && "ring-2 ring-tp-blue/50 ring-offset-1",
            !isSelected && !isInLasso && "hover:ring-2 hover:ring-offset-1"
          )}
          style={{
            backgroundColor: isPriceView ? priceColor : statusBgColor,
            boxShadow:
              !isSelected && !isInLasso
                ? `0 0 0 0.5px ${tableColor}50`
                : undefined,
            // Position seat around the table center
            left: `calc(50% + ${x}px - 12px)`,
            top: `calc(50% + ${y}px - 12px)`,
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
