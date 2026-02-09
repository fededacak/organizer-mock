import { Check, Lock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Seat } from "../seat-settings/types";

interface BrowseSeatRowProps {
  seat: Seat;
  isSelected: boolean;
  isLocked: boolean;
  color: string;
  onAction: () => void;
}

export function BrowseSeatRow({
  seat,
  isSelected,
  isLocked,
  color,
  onAction,
}: BrowseSeatRowProps) {
  return (
    <button
      type="button"
      onClick={onAction}
      className={cn(
        "flex w-full items-center justify-between rounded-[14px] px-2.5 py-2.5 group cursor-pointer bg-light-gray hover:bg-soft-gray",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2 self-stretch shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div className="flex flex-col gap-0.5 text-left">
          <span className="md:text-xs text-sm text-muted-foreground">
            Row {seat.row}, Seat {seat.number}
            {isLocked && <Lock className="inline size-3 ml-1 text-amber-500" />}
          </span>
          <span className="md:text-sm text-base font-semibold text-black">
            ${seat.price}
          </span>
        </div>
      </div>
      <span
        className={cn(
          "size-5 rounded-full flex items-center justify-center",
          isSelected
            ? "bg-tp-blue text-white"
            : isLocked
              ? "bg-amber-500 text-white"
              : "",
        )}
      >
        {isSelected ? (
          <Check className="md:size-3.5 size-4" strokeWidth={2.5} />
        ) : isLocked ? (
          <Lock className="md:size-3.5 size-4" strokeWidth={2.5} />
        ) : (
          <Plus
            className="md:size-3.5 size-4 text-muted-foreground"
            strokeWidth={2.5}
          />
        )}
      </span>
    </button>
  );
}
