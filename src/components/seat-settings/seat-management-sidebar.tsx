"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SelectedSeatsList } from "./selected-seats-list";
import { HoldsSection } from "./holds-section";
import type { Section, Seat, Hold } from "./types";
import {
  ListChevronsDownUp,
  ListChevronsUpDown,
  ChevronDown,
} from "lucide-react";

// Collapsible section wrapper
function CollapsibleSection({
  title,
  isExpanded,
  onToggle,
  children,
  isLast,
}: {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isLast: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        isLast && "border-t border-soft-gray pt-2.5"
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex items-center justify-between gap-2 px-2 py-3 ",
          "cursor-pointer",
          "hover:bg-transparent"
        )}
      >
        <span className="text-sm font-bold text-black">{title}</span>
        <ChevronDown
          className={cn(
            "size-4 text-gray transition-transform duration-200 ease-out",
            !isExpanded && "-rotate-90"
          )}
        />
      </button>

      {/* Content - using CSS Grid for smooth height animation */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

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
  onEditHold: (hold: Hold) => void;
  onDeleteHold: (hold: Hold) => void;
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
  onEditHold,
  onDeleteHold,
  isMinimized,
  onToggleMinimize,
}: SeatManagementSidebarProps) {
  const [isSelectionsExpanded, setIsSelectionsExpanded] = useState(true);
  const [isHoldsExpanded, setIsHoldsExpanded] = useState(true);

  // Calculate selected count for the header
  const selectedCount = Array.from(selectedSeatsBySection.values()).reduce(
    (acc, seats) => acc + seats.length,
    0
  );

  return (
    <>
      {/* Expand button - visible only when minimized */}
      <button
        type="button"
        onClick={onToggleMinimize}
        className={cn(
          "fixed left-[21px] bottom-[21px] z-40 cursor-pointer border border-soft-gray ",
          "flex size-10 items-center justify-center",
          "rounded-full bg-white shadow-floating",
          "text-foreground transition-all duration-250",
          "motion-reduce:transition-none",
          "origin-bottom-left",
          isMinimized
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
        style={{ transitionTimingFunction: EASE_OUT_CUBIC }}
        aria-label="Expand panel"
      >
        <ListChevronsUpDown className="size-5" />
      </button>

      {/* Floating panel - visible when expanded */}
      <div
        className={cn(
          "fixed bottom-2.5 left-2.5 top-2.5 z-40 w-[320px]",
          "flex flex-col gap-2 rounded-[20px] bg-white p-2.5 shadow-floating border border-soft-gray",
          "origin-bottom-left transition-all duration-250",
          "motion-reduce:transition-none",
          isMinimized
            ? "pointer-events-none scale-95 opacity-0"
            : "pointer-events-auto scale-100 opacity-100"
        )}
        style={{ transitionTimingFunction: EASE_OUT_CUBIC }}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto border-b border-soft-gray">
          {/* Selections Section */}
          <CollapsibleSection
            title={`Selections${
              selectedCount > 0 ? ` (${selectedCount})` : ""
            }`}
            isExpanded={isSelectionsExpanded}
            onToggle={() => setIsSelectionsExpanded((prev) => !prev)}
            isLast={false}
          >
            <SelectedSeatsList
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
          </CollapsibleSection>

          {/* Divider */}
          {/* <div className="h-px bg-soft-gray mx-2 my-1" /> */}

          {/* Holds Section */}
          <CollapsibleSection
            title={`Holds${holds.length > 0 ? ` (${holds.length})` : ""}`}
            isExpanded={isHoldsExpanded}
            onToggle={() => setIsHoldsExpanded((prev) => !prev)}
            isLast={true}
          >
            <HoldsSection
              holds={holds}
              onSelectHoldSeats={(seatIds) => onSelectSeats(seatIds, false)}
              onEditHold={onEditHold}
              onDeleteHold={onDeleteHold}
            />
          </CollapsibleSection>
        </div>
        <ManageEventHeader onMinimize={onToggleMinimize} />
      </div>
    </>
  );
}
