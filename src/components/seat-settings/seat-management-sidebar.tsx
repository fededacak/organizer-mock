"use client";

import { cn } from "@/lib/utils";
import { SelectedSeatsList } from "./selected-seats-list";
import type { Section, Seat, Hold } from "./types";
import { ListChevronsDownUp, ListChevronsUpDown } from "lucide-react";

// Manage Event header pill with minimize button
function ManageEventHeader({ onMinimize }: { onMinimize: () => void }) {
  return (
    <button
      type="button"
      onClick={onMinimize}
      className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors duration-200 ease cursor-pointer hover:text-foreground border border-soft-gray"
      aria-label="Minimize panel"
    >
      <ListChevronsDownUp className="size-5" />
    </button>
  );
}

interface SeatManagementSidebarProps {
  sections: Section[];
  holds: Hold[];
  selectedSeatsBySection: Map<Section, Seat[]>;
  onClearSelection: () => void;
  onDeselectRow: (sectionId: string, row: string) => void;
  onSelectSeats: (seatIds: string[], additive?: boolean) => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

// Easing for animations
const EASE_OUT_CUBIC = "cubic-bezier(.215, .61, .355, 1)";

// Main sidebar component - floating panel
export function SeatManagementSidebar({
  sections,
  holds,
  selectedSeatsBySection,
  onClearSelection,
  onDeselectRow,
  onSelectSeats,
  isMinimized,
  onToggleMinimize,
}: SeatManagementSidebarProps) {
  return (
    <>
      {/* Expand button - visible only when minimized */}
      <button
        type="button"
        onClick={onToggleMinimize}
        className={cn(
          "fixed left-[21px] bottom-[21px] z-40 cursor-pointer border border-soft-gray",
          "flex size-10 items-center justify-center",
          "rounded-full bg-white shadow-card",
          "text-foreground transition-all duration-250",
          "motion-reduce:transition-none",
          "origin-bottom-left",
          isMinimized
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
        style={{ transitionTimingFunction: EASE_OUT_CUBIC }}
        aria-label="Expand panel"
      >
        <ListChevronsUpDown className="size-5" />
      </button>

      {/* Floating panel - visible when expanded */}
      <div
        className={cn(
          "fixed bottom-2.5 left-2.5 top-2.5 z-40 w-[380px]",
          "flex flex-col gap-3 rounded-[20px] bg-white p-2.5 shadow-card border border-soft-gray",
          "origin-bottom-left transition-all duration-250",
          "motion-reduce:transition-none",
          isMinimized
            ? "pointer-events-none scale-95 opacity-0"
            : "pointer-events-auto scale-100 opacity-100",
        )}
        style={{ transitionTimingFunction: EASE_OUT_CUBIC }}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <SelectedSeatsList
            sections={sections}
            holds={holds}
            selectedSeatsBySection={selectedSeatsBySection}
            onClearSection={(sectionId: string) => {
              // Clear all seats from a specific section
              const section = sections.find((s) => s.id === sectionId);
              if (section) {
                // Get all rows in this section and deselect them
                const rows = new Set(section.seats.map((s) => s.row));
                rows.forEach((row) => onDeselectRow(sectionId, row));
              }
            }}
            onClearRow={onDeselectRow}
            onSelectSeats={onSelectSeats}
            onClearAll={onClearSelection}
          />
        </div>
        <ManageEventHeader onMinimize={onToggleMinimize} />
      </div>
    </>
  );
}
