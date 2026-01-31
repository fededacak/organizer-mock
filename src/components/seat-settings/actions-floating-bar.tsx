import { X, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

// Icon wrapper component
function IconWrapper({
  className,
  bgColor,
  children,
}: {
  className?: string;
  bgColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full",
        bgColor,
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ActionsFloatingBarProps {
  selectedCount: number;
  onClear: () => void;
  onEditPrice: () => void;
  onHold: () => void;
}

export function ActionsFloatingBar({
  selectedCount,
  onClear,
  onEditPrice,
  onHold,
}: ActionsFloatingBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-2.5 left-1/2 -translate-x-1/2 z-50",
        "flex items-center justify-between gap-3 rounded-[20px] md:min-w-[400px] border border-soft-gray bg-white px-4 py-3 shadow-card",
        "transition-all duration-300 cubic-bezier(.23,1,.32,1)",
        selectedCount > 0
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none",
      )}
    >
      <div className="flex items-center gap-3 w-full">
        <span className="font-outfit text-sm font-semibold text-dark-gray whitespace-nowrap">
          {selectedCount} seat{selectedCount !== 1 ? "s" : ""}
        </span>

        <div className="flex items-center gap-3 w-full justify-end">
          {/* Edit/Price button */}
          <button
            type="button"
            onClick={onEditPrice}
            className="flex items-center gap-2 rounded-full bg-light-gray px-3 py-2.5 transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer"
          >
            <IconWrapper className="size-[18px]" bgColor="bg-tp-orange">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="none"
              >
                <path
                  d="M7.53918 0.279449C7.3602 0.100518 7.11747 0 6.86439 0C6.6113 0 6.36858 0.100518 6.18959 0.279449L5.40456 1.06496L7.93528 3.59568L8.72031 2.81112C8.80898 2.72249 8.87932 2.61725 8.92731 2.50143C8.9753 2.38561 9 2.26146 9 2.13609C9 2.01072 8.9753 1.88657 8.92731 1.77075C8.87932 1.65492 8.80898 1.54969 8.72031 1.46106L7.53918 0.279449ZM7.26048 4.27047L4.72977 1.73975L0.513493 5.95603L0 9.00072L3.04469 8.48675L7.26048 4.27047Z"
                  fill="white"
                />
              </svg>
            </IconWrapper>
            <span className="font-outfit text-sm font-semibold text-black">
              Price
            </span>
          </button>

          {/* Hold button */}
          <button
            type="button"
            onClick={onHold}
            className="flex items-center gap-2 rounded-full bg-light-gray px-3 py-2.5 transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer"
          >
            <IconWrapper className="size-[18px]" bgColor="bg-tp-purple">
              <Pause
                className="size-2.5 text-white"
                strokeWidth={3}
                fill="currentColor"
              />
            </IconWrapper>
            <span className="font-outfit text-sm font-semibold text-black">
              Hold
            </span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="flex items-center justify-center p-1 transition-colors duration-200 ease hover:bg-light-gray rounded-full cursor-pointer"
        aria-label="Clear selection"
      >
        <X className="size-[18px] text-gray" strokeWidth={2} />
      </button>
    </div>
  );
}
