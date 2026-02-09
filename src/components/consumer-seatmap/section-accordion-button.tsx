import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionAccordionButtonProps {
  name: string;
  lowestPrice: number | null;
  isSoldOut: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  color: string;
  selectedCount?: number;
}

export function SectionAccordionButton({
  name,
  lowestPrice,
  isSoldOut,
  isExpanded,
  onToggle,
  color,
  selectedCount = 0,
}: SectionAccordionButtonProps) {
  return (
    <button
      type="button"
      onClick={() => !isSoldOut && onToggle()}
      disabled={isSoldOut}
      className={cn(
        "w-full px-3 md:py-3 py-4 pl-[22px] flex items-center justify-between gap-3",
        isSoldOut
          ? "cursor-not-allowed opacity-50"
          : cn(
              "hover:bg-light-gray cursor-pointer",
              isExpanded && "bg-light-gray",
            ),
      )}
    >
      <div className="flex items-center gap-2 flex-1 justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "md:text-xs text-sm font-semibold uppercase tracking-wide",
              isSoldOut ? "text-gray-400" : "text-gray-500",
            )}
          >
            {name}
          </span>
          {selectedCount > 0 && (
            <span className="bg-tp-blue text-white md:text-[10px] text-sm font-bold md:size-4 size-6 shrink-0 rounded-full flex items-center justify-center">
              {selectedCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isSoldOut ? (
            <span className="text-xs text-gray-400 font-medium">Sold Out</span>
          ) : (
            <span className="md:text-sm text-base font-semibold text-black">
              ${lowestPrice}
            </span>
          )}
        </div>
      </div>
      <ChevronDown
        className={cn(
          "size-4 text-gray-400 transition-transform duration-200",
          isExpanded && "rotate-180",
        )}
      />
    </button>
  );
}
