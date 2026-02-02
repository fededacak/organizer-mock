"use client";

import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Hold } from "./types";

interface HoldsSectionProps {
  holds: Hold[];
  onSelectHoldSeats: (seatIds: string[]) => void;
  onEditHold: (hold: Hold) => void;
  onDeleteHold: (hold: Hold) => void;
}

function HoldItem({
  hold,
  onSelect,
  onEdit,
  onDelete,
}: {
  hold: Hold;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className={cn(
        "group flex items-center justify-between gap-2 rounded-[10px] px-3 pl-2 py-2 border border-soft-gray",
        "cursor-pointer transition-colors duration-200 ease",
        "hover:bg-light-gray"
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {/* Hold info */}
      <div className="flex items-center gap-2 min-w-0 self-stretch">
        <div
          className="h-full w-2 rounded-full shrink-0"
          style={{ backgroundColor: hold.color }}
        />
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-black truncate">
              {hold.name}
            </span>
            <span className="text-xs text-gray shrink-0">
              ({hold.seatIds.length})
            </span>
          </div>
          {hold.startDate && hold.endDate && (
            <span className="text-xs text-gray">
              {format(hold.startDate, "MMM d")} -{" "}
              {format(hold.endDate, "MMM d")}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div
        className="flex items-center gap-1"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex size-7 items-center text-gray hover:text-black justify-center rounded-full hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer"
          aria-label={`Edit ${hold.name}`}
        >
          <Pencil className="size-3.5 " />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex size-7 items-center text-gray hover:text-red-500 justify-center rounded-full hover:bg-red-50 transition-colors duration-200 ease cursor-pointer"
          aria-label={`Delete ${hold.name}`}
        >
          <Trash2 className="size-3.5 " />
        </button>
      </div>
    </motion.div>
  );
}

export function HoldsSection({
  holds,
  onSelectHoldSeats,
  onEditHold,
  onDeleteHold,
}: HoldsSectionProps) {
  // Empty state
  if (holds.length === 0) {
    return (
      <div className="flex flex-col gap-0.5 items-center justify-center py-7">
        <p className="text-sm text-gray">No holds yet</p>
        <p className="text-xs text-gray/70">
          Select seats and click Hold to create one
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {holds.map((hold) => (
          <HoldItem
            key={hold.id}
            hold={hold}
            onSelect={() => onSelectHoldSeats(hold.seatIds)}
            onEdit={() => onEditHold(hold)}
            onDelete={() => onDeleteHold(hold)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
