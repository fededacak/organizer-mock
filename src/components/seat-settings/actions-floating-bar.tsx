import { X, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

// Lock icon component
function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="10"
      viewBox="0 0 9 10"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 3C1.5 2.20435 1.81607 1.44129 2.37868 0.87868C2.94129 0.31607 3.70435 0 4.5 0C5.29565 0 6.05871 0.31607 6.62132 0.87868C7.18393 1.44129 7.5 2.20435 7.5 3H8C8.26522 3 8.51957 3.10536 8.70711 3.29289C8.89464 3.48043 9 3.73478 9 4V9C9 9.26522 8.89464 9.51957 8.70711 9.70711C8.51957 9.89464 8.26522 10 8 10H1C0.734784 10 0.48043 9.89464 0.292893 9.70711C0.105357 9.51957 0 9.26522 0 9V4C0 3.73478 0.105357 3.48043 0.292893 3.29289C0.48043 3.10536 0.734784 3 1 3H1.5ZM4.5 1C5.03043 1 5.53914 1.21071 5.91421 1.58579C6.28929 1.96086 6.5 2.46957 6.5 3H2.5C2.5 2.46957 2.71071 1.96086 3.08579 1.58579C3.46086 1.21071 3.96957 1 4.5 1ZM5.5 6C5.5 6.17553 5.45379 6.34797 5.36602 6.49999C5.27825 6.652 5.15202 6.77823 5 6.866V7.5C5 7.63261 4.94732 7.75979 4.85355 7.85355C4.75979 7.94732 4.63261 8 4.5 8C4.36739 8 4.24021 7.94732 4.14645 7.85355C4.05268 7.75979 4 7.63261 4 7.5V6.866C3.80937 6.75593 3.66039 6.58603 3.57615 6.38266C3.49192 6.17929 3.47715 5.9538 3.53412 5.74118C3.59109 5.52855 3.71663 5.34067 3.89127 5.20666C4.0659 5.07265 4.27987 5.00001 4.5 5C4.76522 5 5.01957 5.10536 5.20711 5.29289C5.39464 5.48043 5.5 5.73478 5.5 6Z"
        fill="white"
      />
    </svg>
  );
}

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
        className
      )}
    >
      {children}
    </div>
  );
}

export type HoldState = "none" | "single" | "mixed";

interface ActionsFloatingBarProps {
  selectedCount: number;
  holdState: HoldState;
  onClear: () => void;
  onEditPrice: () => void;
  onHold: () => void;
  onRemoveFromHold?: () => void;
}

export function ActionsFloatingBar({
  selectedCount,
  holdState,
  onClear,
  onEditPrice,
  onHold,
  onRemoveFromHold,
}: ActionsFloatingBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-2.5 left-1/2 -translate-x-1/2 z-50",
        "flex items-center justify-between gap-3 rounded-[20px] md:min-w-[400px] border border-soft-gray bg-white px-4 py-3 shadow-card",
        "transition-all duration-300 cubic-bezier(.23,1,.32,1)",
        selectedCount > 0
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
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
              Edit Price
            </span>
          </button>

          {/* Hold button - conditional based on holdState */}
          {holdState === "none" && (
            <button
              type="button"
              onClick={onHold}
              className="flex items-center gap-2 rounded-full bg-light-gray px-3 py-2.5 transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer"
            >
              <IconWrapper className="size-[18px]" bgColor="bg-tp-purple">
                <LockIcon />
              </IconWrapper>
              <span className="font-outfit text-sm font-semibold text-black">
                Hold Seats
              </span>
            </button>
          )}

          {/* Remove from Hold button - when all selected seats share a hold */}
          {holdState === "single" && onRemoveFromHold && (
            <button
              type="button"
              onClick={onRemoveFromHold}
              className="flex items-center gap-2 rounded-full bg-light-gray px-3 py-2.5 transition-colors duration-200 ease hover:bg-red-50 cursor-pointer group"
            >
              <IconWrapper
                className="size-[18px] group-hover:bg-red-500 transition-colors duration-200 ease"
                bgColor="bg-tp-purple"
              >
                <X className="size-2.5 text-white" strokeWidth={2.5} />
              </IconWrapper>
              <span className="font-outfit text-sm font-semibold text-black group-hover:text-red-500 transition-colors duration-200 ease">
                Remove from Hold
              </span>
            </button>
          )}

          {/* When holdState is "mixed", no hold button is shown */}
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
