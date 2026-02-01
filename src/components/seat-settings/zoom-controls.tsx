import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface ZoomControlsProps {
  scale: number;
  minScale: number;
  maxScale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function ZoomControls({
  scale,
  minScale,
  maxScale,
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps) {
  return (
    <div className="flex items-center rounded-full bg-white p-1 border border-soft-gray h-fit">
      <button
        type="button"
        onClick={onZoomOut}
        disabled={scale <= minScale}
        className={cn(
          "flex size-7 items-center rounded-full justify-center text-sm font-medium transition-all duration-200 ease cursor-pointer",
          scale <= minScale
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100 hover:text-black",
        )}
        title="Zoom out"
      >
<Minus className="size-4" />
      </button>
      <button
        type="button"
        onClick={onReset}
        className="flex h-7 min-w-[48px] items-center justify-center rounded-md px-2 text-xs font-medium text-foreground transition-all duration-200 ease hover:bg-gray-100 hover:text-black cursor-pointer"
        title="Reset zoom"
      >
        {Math.round(scale * 100)}%
      </button>
      <button
        type="button"
        onClick={onZoomIn}
        disabled={scale >= maxScale}
        className={cn(
          "flex size-7 items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ease cursor-pointer",
          scale >= maxScale
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100 hover:text-black",
        )}
        title="Zoom in"
      >
<Plus className="size-4" />
      </button>
    </div>
  );
}
