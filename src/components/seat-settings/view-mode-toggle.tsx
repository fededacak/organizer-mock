import { cn } from "@/lib/utils";
import type { ViewMode } from "./types";

interface ViewModeToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ mode, onModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex h-[36px] items-center rounded-full bg-light-gray p-1">
      <button
        type="button"
        onClick={() => onModeChange("status")}
        className={cn(
          "h-full px-4 rounded-full text-xs font-semibold transition-all duration-200 ease cursor-pointer",
          mode === "status"
            ? "bg-white text-black shadow-sm"
            : "text-gray hover:text-dark-gray",
        )}
      >
        Status
      </button>
      <button
        type="button"
        onClick={() => onModeChange("price")}
        className={cn(
          "h-full px-4 rounded-full text-xs font-semibold transition-all duration-200 ease cursor-pointer",
          mode === "price"
            ? "bg-white text-black shadow-sm"
            : "text-gray hover:text-dark-gray",
        )}
      >
        Price
      </button>
    </div>
  );
}
