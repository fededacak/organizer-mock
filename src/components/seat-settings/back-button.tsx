"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  /** Whether the sidebar is expanded (not minimized) */
  sidebarExpanded: boolean;
  /** Optional custom class name */
  className?: string;
}

// Easing for animations - ease-out-quint per animation guidelines
const EASE_OUT_QUINT = "cubic-bezier(.23, 1, .32, 1)";

/**
 * Back button that navigates to main menu, positioned based on sidebar state.
 * When sidebar is expanded, it stays to the right of the sidebar.
 * When sidebar is minimized, it moves to the far left.
 */
export function BackButton({ sidebarExpanded, className }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        // Fixed positioning in top-left area
        "fixed top-2.5 z-50",
        // Hidden on mobile - use browser navigation instead
        "hidden md:flex",
        // Button styling - pill shape
        "items-center gap-2.5 pl-2 pr-3 py-2",
        "rounded-full bg-white border border-soft-gray",
        "cursor-pointer",
        // Hover state
        "transition-[left,background-color] duration-250",
        "group",
        // Accessibility
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-tp-blue focus-visible:ring-offset-2",
        // Dynamic left position based on sidebar state
        sidebarExpanded ? "left-[340px]" : "left-2.5",
        className
      )}
      style={{ transitionTimingFunction: EASE_OUT_QUINT }}
      aria-label="Go to main menu"
    >
      {/* Circular icon container */}
      <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-mid-gray">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="9"
          viewBox="0 0 11 9"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M3.61997 0.254758L0.31997 3.55476C0.114969 3.75976 -3.07637e-05 4.03976 -3.0751e-05 4.32976C-3.07383e-05 4.61976 0.114969 4.89976 0.31997 5.10476L3.61997 8.40476C3.81997 8.63976 4.10497 8.77476 4.41497 8.78976C4.72497 8.80476 5.01997 8.68476 5.23497 8.46976C5.44997 8.25476 5.56997 7.95476 5.55497 7.64976C5.54497 7.34476 5.40497 7.05476 5.16997 6.85476L3.74997 5.43476L9.89997 5.43476C10.295 5.43476 10.655 5.22476 10.855 4.88476C11.05 4.54476 11.05 4.12476 10.855 3.78476C10.66 3.44476 10.295 3.23476 9.89997 3.23476L3.74997 3.23476L5.16997 1.81476C5.41497 1.52976 5.49497 1.14476 5.38997 0.789759C5.28497 0.429759 5.00497 0.15476 4.64497 0.0447598C4.28997 -0.0602401 3.89997 0.0197605 3.61997 0.264761V0.254758Z"
            fill="white"
          />
        </svg>
      </div>
      {/* Label */}
      <span className="font-outfit text-sm text-foreground">Main menu</span>
    </button>
  );
}
