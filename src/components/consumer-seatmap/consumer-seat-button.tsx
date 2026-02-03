"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Seat, Hold } from "../seat-settings/types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export type ConsumerSeatState =
  | "available"
  | "selected"
  | "sold"
  | "unavailable"
  | "locked";

export interface ConsumerSeatButtonProps {
  seat: Seat;
  sectionName: string;
  sectionColor: string;
  hold?: Hold;
  isSelected: boolean;
  isUnlocked: boolean;
  onSelect: () => void;
  onLockedClick: () => void;
}

/**
 * Get the visual state of a seat for consumer view
 */
export function getConsumerSeatState(
  seat: Seat,
  hold: Hold | undefined,
  isUnlocked: boolean
): ConsumerSeatState {
  if (seat.status === "sold") return "sold";
  if (seat.status === "on-sale") return "available";
  if (seat.status === "held") {
    if (!hold) return "unavailable";
    if (hold.type === "internal") return "unavailable";
    if (hold.type === "password-protected") {
      return isUnlocked ? "available" : "locked";
    }
  }
  return "unavailable";
}

/**
 * Consumer seat button component
 * Displays seats with consumer-appropriate states and interactions
 */
export function ConsumerSeatButton({
  seat,
  sectionName,
  sectionColor,
  hold,
  isSelected,
  isUnlocked,
  onSelect,
  onLockedClick,
}: ConsumerSeatButtonProps) {
  const state = getConsumerSeatState(seat, hold, isUnlocked);
  const isClickable = state === "available" || state === "locked";
  const priceLabel = `$${seat.price}`;

  // Handle click based on state
  const handleClick = () => {
    if (state === "locked") {
      onLockedClick();
    } else if (state === "available") {
      onSelect();
    }
  };

  // Build tooltip
  let tooltip = `${sectionName} - Row ${seat.row}, Seat ${seat.number}`;
  if (state === "locked" && hold) {
    tooltip += ` (${hold.name} - Password required)`;
  } else if (state === "sold") {
    tooltip += " (Sold)";
  } else if (state === "unavailable") {
    tooltip += " (Unavailable)";
  } else {
    tooltip += ` - ${priceLabel}`;
  }

  // Get border color based on state
  const getBorderStyle = () => {
    if (state === "available") {
      return `0 0 0 1px ${sectionColor}`;
    }
    return undefined;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleClick}
          disabled={!isClickable}
          className={cn(
            "size-6 rounded-[2px] transition-all duration-150 ease-out relative flex items-center justify-center",
            isClickable ? "cursor-pointer" : "cursor-not-allowed",
            // Use outline for selection since ring uses box-shadow which conflicts with inline boxShadow
            isSelected && "outline-2 outline-offset-1 outline-tp-blue",
            // Background colors as classes so hover can override
            state === "available" &&
              !isSelected &&
              "bg-white hover:bg-gray-100",
            state === "available" && isSelected && "bg-tp-blue/10",
            state === "locked" && "bg-amber-500",
            (state === "sold" || state === "unavailable") && "bg-gray-400",
            state === "locked" &&
              !isSelected &&
              "hover:outline-2 hover:outline-offset-1 hover:outline-tp-blue/50"
          )}
          style={{
            boxShadow: getBorderStyle(),
          }}
          data-seat-id={seat.id}
          data-seat-state={state}
        >
          {state === "locked" && (
            <Lock className="size-3 text-white" strokeWidth={2.5} />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-gray-900 text-white border-none">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
