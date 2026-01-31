import { cn } from "@/lib/utils";

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
    <div className="flex items-center gap-1 rounded-lg bg-white p-1 shadow-md border border-gray-200">
      <button
        type="button"
        onClick={onZoomOut}
        disabled={scale <= minScale}
        className={cn(
          "flex size-8 items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ease cursor-pointer",
          scale <= minScale
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100 hover:text-black",
        )}
        title="Zoom out"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 8H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={onReset}
        className="flex h-8 min-w-[48px] items-center justify-center rounded-md px-2 text-xs font-medium text-gray-600 transition-all duration-200 ease hover:bg-gray-100 hover:text-black cursor-pointer"
        title="Reset zoom"
      >
        {Math.round(scale * 100)}%
      </button>
      <button
        type="button"
        onClick={onZoomIn}
        disabled={scale >= maxScale}
        className={cn(
          "flex size-8 items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ease cursor-pointer",
          scale >= maxScale
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100 hover:text-black",
        )}
        title="Zoom in"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 3V13M3 8H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
