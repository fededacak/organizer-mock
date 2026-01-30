"use client";

import { SelectedSeatsList } from "./selected-seats-list";
import type { Section, Seat, Hold } from "./types";

// Manage Event header pill
function ManageEventHeader() {
  return (
    <div className="flex h-[38px] items-center gap-2.5 rounded-full bg-white p-2">
      <div className="flex size-[22px] items-center justify-center rounded-full bg-mid-gray">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="9"
          viewBox="0 0 11 9"
          fill="none"
        >
          <path
            d="M3.62021 0.255247L0.320214 3.55525C0.115213 3.76025 0.000213377 4.04025 0.00021339 4.33025C0.000213402 4.62025 0.115213 4.90025 0.320214 5.10525L3.62021 8.40525C3.82021 8.64025 4.10521 8.77525 4.41521 8.79025C4.72521 8.80525 5.02022 8.68525 5.23522 8.47025C5.45022 8.25525 5.57022 7.95525 5.55522 7.65025C5.54522 7.34525 5.40521 7.05525 5.17021 6.85525L3.75021 5.43525L9.90022 5.43525C10.2952 5.43525 10.6552 5.22525 10.8552 4.88525C11.0502 4.54525 11.0502 4.12525 10.8552 3.78525C10.6602 3.44525 10.2952 3.23525 9.90022 3.23525L3.75021 3.23525L5.17021 1.81525C5.41521 1.53025 5.49521 1.14525 5.39021 0.790247C5.28521 0.430247 5.00521 0.155248 4.64521 0.045248C4.29021 -0.0597518 3.90021 0.0202488 3.62021 0.265249V0.255247Z"
            fill="white"
          />
        </svg>
      </div>
      <span className="font-outfit text-sm text-black">Manage Event</span>
    </div>
  );
}

interface SeatManagementSidebarProps {
  sections: Section[];
  holds: Hold[];
  selectedSeatsBySection: Map<Section, Seat[]>;
  onClearSelection: () => void;
  onDeselectRow: (sectionId: string, row: string) => void;
  onSelectSeats: (seatIds: string[], additive?: boolean) => void;
}

// Main sidebar component
export function SeatManagementSidebar({
  sections,
  holds,
  selectedSeatsBySection,
  onClearSelection,
  onDeselectRow,
  onSelectSeats,
}: SeatManagementSidebarProps) {
  return (
    <div className="flex h-full shrink-0 py-2.5 pl-2.5">
      <div className="flex h-full w-[380px] flex-col gap-3 rounded-[20px] bg-white p-2.5 shadow-card">
        <ManageEventHeader />

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
      </div>
    </div>
  );
}
