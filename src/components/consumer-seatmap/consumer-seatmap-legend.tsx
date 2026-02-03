"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Consumer seatmap legend
 * Shows the meaning of different seat colors for consumers
 */
export function ConsumerSeatmapLegend() {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-1 bg-white border border-soft-gray p-3 shadow-floating rounded-[16px]"
      )}
    >
      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">
        Legend
      </span>

      {/* Available */}
      <div className="flex items-center gap-2">
        <div
          className="size-4 rounded-[4px] bg-white"
          style={{ boxShadow: "0 0 0 1px #4F46E5" }}
        />
        <span className="text-xs text-gray-700">Available</span>
      </div>

      {/* Password Protected */}
      <div className="flex items-center gap-2">
        <div className="size-4 rounded-[4px] bg-amber-500 flex items-center justify-center">
          <Lock className="size-2.5 text-white" strokeWidth={3} />
        </div>
        <span className="text-xs text-gray-700">Password Required</span>
      </div>

      {/* Sold / Unavailable */}
      <div className="flex items-center gap-2">
        <div className="size-4 rounded-[4px] bg-gray-400" />
        <span className="text-xs text-gray-700">Sold / Unavailable</span>
      </div>
    </div>
  );
}
