import { X, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SelectionInfo, Hold } from "./types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

// Unlock icon component
function UnlockIcon() {
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
        d="M4.35829 0C4.88662 0 5.38346 0.145993 5.81106 0.40198C5.86893 0.433236 5.92008 0.476255 5.96143 0.52845C6.00278 0.580644 6.03348 0.640936 6.05167 0.705696C6.06987 0.770457 6.07519 0.838349 6.06732 0.905288C6.05944 0.972227 6.03853 1.03683 6.00585 1.09521C5.97316 1.15359 5.92938 1.20454 5.87713 1.245C5.82488 1.28545 5.76524 1.31458 5.7018 1.33062C5.63837 1.34666 5.57245 1.34929 5.508 1.33835C5.44356 1.3274 5.38192 1.30311 5.3268 1.26694C5.03227 1.09137 4.69816 0.998959 4.35806 0.999001C4.01797 0.999042 3.68388 1.09153 3.38939 1.26717C3.0949 1.44281 2.85038 1.69541 2.68044 1.99957C2.5105 2.30372 2.42111 2.64871 2.42127 2.99985L7.74808 3.00035C8.00494 3.00035 8.25129 3.1057 8.43292 3.29323C8.61455 3.48076 8.71659 3.7351 8.71659 4.0003V9.00005C8.71659 9.26525 8.61455 9.51959 8.43292 9.70712C8.25129 9.89465 8.00494 10 7.74808 10H0.96851C0.711645 10 0.465301 9.89465 0.28367 9.70712C0.102039 9.51959 0 9.26525 0 9.00005V3.9998C0 3.7346 0.102039 3.48026 0.28367 3.29273C0.465301 3.1052 0.711645 2.99985 0.96851 2.99985H1.45276C1.45276 2.20424 1.75888 1.44122 2.30377 0.878636C2.84867 0.316055 3.5877 0 4.35829 0ZM4.35829 4.99975C4.1451 4.99976 3.93787 5.0724 3.76873 5.2064C3.59959 5.3404 3.47801 5.52828 3.42283 5.74089C3.36765 5.95351 3.38196 6.17898 3.46354 6.38234C3.54512 6.5857 3.68941 6.75559 3.87404 6.86566V7.49963C3.87404 7.63223 3.92506 7.7594 4.01587 7.85316C4.10669 7.94693 4.22986 7.9996 4.35829 7.9996C4.48673 7.9996 4.6099 7.94693 4.70071 7.85316C4.79153 7.7594 4.84255 7.63223 4.84255 7.49963V6.86566C5.02718 6.75559 5.17147 6.5857 5.25305 6.38234C5.33463 6.17898 5.34894 5.95351 5.29376 5.74089C5.23858 5.52828 5.11699 5.3404 4.94786 5.2064C4.77872 5.0724 4.57149 4.99976 4.35829 4.99975ZM8.19262 1.51042L8.66042 1.64042C8.77969 1.67897 8.87991 1.76364 8.94011 1.87672C9.00032 1.9898 9.01584 2.12254 8.98345 2.24716C8.95105 2.37179 8.87324 2.47866 8.76628 2.54542C8.65933 2.61218 8.53151 2.63366 8.40957 2.60537L7.94227 2.47638C7.81873 2.44161 7.71356 2.35774 7.64977 2.24312C7.58597 2.1285 7.56873 1.99246 7.60183 1.86476C7.63493 1.73705 7.71567 1.62808 7.82638 1.56168C7.9371 1.49528 8.06878 1.47685 8.19262 1.51042ZM7.57036 0.0449977C7.63179 0.0619961 7.68938 0.0913233 7.73984 0.131304C7.79029 0.171285 7.83263 0.221137 7.86442 0.278012C7.89621 0.334887 7.91684 0.397671 7.92513 0.462778C7.93342 0.527886 7.9292 0.594042 7.91273 0.657467L7.85026 0.898455C7.83406 0.962149 7.80583 1.02191 7.76719 1.07431C7.72856 1.12671 7.68028 1.17071 7.62512 1.20379C7.56997 1.23687 7.50903 1.25837 7.44581 1.26706C7.38258 1.27576 7.31832 1.27147 7.2567 1.25445C7.19509 1.23742 7.13733 1.208 7.08676 1.16787C7.03619 1.12773 6.9938 1.07768 6.96202 1.02058C6.93024 0.963486 6.9097 0.900469 6.90157 0.835152C6.89345 0.769835 6.8979 0.703503 6.91468 0.639968L6.97763 0.39848C7.01089 0.27049 7.092 0.161365 7.20314 0.0950844C7.31428 0.0288037 7.44636 0.0107886 7.57036 0.0449977Z"
        fill="white"
      />
    </svg>
  );
}

// Icon wrapper component
function IconWrapper({
  className,
  bgColor,
  style,
  children,
}: {
  className?: string;
  bgColor?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full",
        bgColor,
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

// Keep legacy type export for backwards compatibility
export type HoldState = "none" | "single" | "mixed";

interface ActionsFloatingBarProps {
  selectionInfo: SelectionInfo;
  availableHolds: Hold[];
  onClear: () => void;
  onEditPrice: () => void;
  onHold: () => void;
  onReleaseHeld: () => void;
  onAddToExistingHold: (hold: Hold) => void;
}

export function ActionsFloatingBar({
  selectionInfo,
  availableHolds,
  onClear,
  onEditPrice,
  onHold,
  onReleaseHeld,
  onAddToExistingHold,
}: ActionsFloatingBarProps) {
  const {
    totalCount,
    heldCount,
    onSaleCount,
    soldCount,
    uniqueHolds,
    allHeld,
    allOnSale,
    allSold,
    canHold,
    canRelease,
  } = selectionInfo;

  // Build context string for count display
  const getCountDisplay = () => {
    return `${totalCount} seat${totalCount !== 1 ? "s" : ""}`;
  };

  // Hold button with dropdown for adding/moving to existing holds
  const renderHoldDropdown = (label: string = "Hold Seats") => {
    // If no holds exist, show simple button
    if (availableHolds.length === 0) {
      return (
        <button
          type="button"
          onClick={onHold}
          className="flex items-center gap-2 rounded-full bg-light-gray px-3 py-2.5 transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer"
        >
          <IconWrapper className="size-[18px]" bgColor="bg-tp-purple">
            <LockIcon />
          </IconWrapper>
          <span className="font-outfit text-sm font-semibold text-black">
            {label}
          </span>
        </button>
      );
    }

    // If holds exist, show dropdown
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="group flex items-center gap-2 rounded-full bg-light-gray px-3 py-2.5 transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer"
          >
            <IconWrapper className="size-[18px]" bgColor="bg-tp-purple">
              <LockIcon />
            </IconWrapper>
            <span className="font-outfit text-sm font-semibold text-black">
              {label}
            </span>
            <ChevronDown className="size-3.5 text-gray transition-transform duration-200 ease group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" sideOffset={8}>
          <DropdownMenuItem onClick={onHold}>
            <Plus className="size-4 text-gray" />
            <span>New hold</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {availableHolds.map((hold) => (
            <DropdownMenuItem
              key={hold.id}
              onClick={() => onAddToExistingHold(hold)}
            >
              <div
                className="size-3 rounded-full shrink-0"
                style={{ backgroundColor: hold.color }}
              />
              <span>{hold.name}</span>
              {hold.seatIds.length > 0 && (
                <span className="text-xs text-gray ml-auto">
                  ({hold.seatIds.length})
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Determine the primary hold action based on selection state
  const renderHoldActions = () => {
    // Scenario 1: All on-sale (no holds in selection) - show "Hold Seats" or dropdown
    if (allOnSale) {
      return renderHoldDropdown();
    }

    // Scenario 2: All sold - no hold actions
    if (allSold) {
      return null;
    }

    // Scenario 3: Held seats from single hold (no on-sale) - show "Release"
    // This covers: all held from one hold, OR held from one hold + sold seats
    if (!canHold && canRelease && uniqueHolds.length === 1) {
      return (
        <button
          type="button"
          onClick={onReleaseHeld}
          className="flex items-center gap-2 rounded-full bg-light-gray px-3 py-2.5 transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer group"
        >
          <IconWrapper
            className="size-[18px] transition-colors duration-200 ease"
            bgColor="bg-tp-purple"
          >
            <UnlockIcon />
          </IconWrapper>
          <span className="font-outfit text-sm font-semibold text-black transition-colors duration-200 ease">
            Release
          </span>
        </button>
      );
    }

    // Scenario 4: Held seats from multiple holds (no on-sale) - show "Move to Hold" dropdown and "Release All"
    // This covers: all held from multiple holds, OR held from multiple holds + sold seats
    if (!canHold && canRelease && uniqueHolds.length > 1) {
      return (
        <>
          {renderHoldDropdown("Move to Hold")}
          <button
            type="button"
            onClick={onReleaseHeld}
            className="flex items-center gap-2 rounded-full bg-light-gray px-3 py-2.5 transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer group"
          >
            <IconWrapper
              className="size-[18px] transition-colors duration-200 ease"
              bgColor="bg-tp-purple"
            >
              <UnlockIcon />
            </IconWrapper>
            <span className="font-outfit text-sm font-semibold text-black transition-colors duration-200 ease">
              Release All
            </span>
          </button>
        </>
      );
    }

    // Scenario 5: On-sale + held (single hold) - THE KEY SCENARIO
    // Show "Add to [Hold Name]" and "Release Held"
    if (canHold && canRelease && uniqueHolds.length === 1) {
      const hold = uniqueHolds[0];
      return (
        <>
          <button
            type="button"
            onClick={() => onAddToExistingHold(hold)}
            className="flex items-center gap-2 rounded-full bg-light-gray px-3 py-2.5 transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer"
          >
            <IconWrapper
              className="size-[18px]"
              style={{ backgroundColor: hold.color }}
            >
              <LockIcon />
            </IconWrapper>
            <span className="font-outfit text-sm font-semibold text-black">
              Add to {hold.name}
            </span>
          </button>
          <button
            type="button"
            onClick={onReleaseHeld}
            className="flex items-center gap-2 rounded-full bg-light-gray px-3 py-2.5 transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer group"
          >
            <IconWrapper
              className="size-[18px] transition-colors duration-200 ease"
              bgColor="bg-tp-purple"
            >
              <UnlockIcon />
            </IconWrapper>
            <span className="font-outfit text-sm font-semibold text-black transition-colors duration-200 ease">
              Release Held
            </span>
          </button>
        </>
      );
    }

    // Scenario 6: On-sale + held (multiple holds) - show "Hold All" dropdown and "Release Held"
    if (canHold && canRelease && uniqueHolds.length > 1) {
      return (
        <>
          {renderHoldDropdown("Hold All")}
          <button
            type="button"
            onClick={onReleaseHeld}
            className="flex items-center gap-2 rounded-full bg-light-gray px-3 py-2.5 transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer group"
          >
            <IconWrapper
              className="size-[18px] transition-colors duration-200 ease"
              bgColor="bg-tp-purple"
            >
              <UnlockIcon />
            </IconWrapper>
            <span className="font-outfit text-sm font-semibold text-black transition-colors duration-200 ease">
              Release Held
            </span>
          </button>
        </>
      );
    }

    // Scenario 7: Mix with sold seats but no holds - show "Hold Seats" dropdown if there are on-sale seats
    if (canHold && !canRelease) {
      return renderHoldDropdown();
    }

    // Fallback: Only held seats with sold seats mixed in
    if (canRelease && !canHold) {
      return (
        <button
          type="button"
          onClick={onReleaseHeld}
          className="flex items-center gap-2 rounded-full bg-light-gray px-3 py-2.5 transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer group"
        >
          <IconWrapper
            className="size-[18px] transition-colors duration-200 ease"
            bgColor="bg-tp-purple"
          >
            <UnlockIcon />
          </IconWrapper>
          <span className="font-outfit text-sm font-semibold text-black transition-colors duration-200 ease">
            Release Held
          </span>
        </button>
      );
    }

    return null;
  };

  return (
    <div
      className={cn(
        "fixed bottom-2.5 left-2.5 right-2.5 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50",
        "flex items-center justify-between gap-3 rounded-[20px] md:min-w-[400px] border border-soft-gray bg-white px-4 py-3 shadow-card",
        "transition-all duration-300 cubic-bezier(.23,1,.32,1)",
        totalCount > 0
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-3 w-full">
        <span className="font-outfit text-sm font-semibold text-dark-gray whitespace-nowrap">
          {getCountDisplay()}
        </span>

        <div className="flex items-center gap-2 w-full justify-end">
          {/* Edit Price button - always visible */}
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

          {/* Contextual hold actions */}
          {renderHoldActions()}
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
