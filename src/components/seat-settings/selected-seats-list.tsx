"use client";

import { X, MousePointerClick } from "lucide-react";
import type { Section, Seat, Hold } from "./types";

interface SelectedSeatsListProps {
  sections: Section[];
  holds: Hold[];
  selectedSeatsBySection: Map<Section, Seat[]>;
  onClearSection: (sectionId: string) => void;
  onClearRow: (sectionId: string, row: string) => void;
  onSelectSeats: (seatIds: string[], additive?: boolean) => void;
  onClearAll: () => void;
}

// Group seats by row for cleaner display
function groupSeatsByRow(seats: Seat[]) {
  const rows = new Map<string, Seat[]>();
  for (const seat of seats) {
    const existing = rows.get(seat.row) || [];
    existing.push(seat);
    rows.set(seat.row, existing);
  }
  return rows;
}

// Format seat numbers for display (e.g., "1, 2, 3" or "1-5")
function formatSeatNumbers(seats: Seat[]): string {
  const sorted = seats.map((s) => parseInt(s.number)).sort((a, b) => a - b);
  if (sorted.length <= 3) {
    return sorted.join(", ");
  }

  // Check if consecutive
  let isConsecutive = true;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) {
      isConsecutive = false;
      break;
    }
  }

  if (isConsecutive) {
    return `${sorted[0]}-${sorted[sorted.length - 1]}`;
  }

  return sorted.join(", ");
}

// Calculate total price for seats in a section
function calculateSectionTotal(seats: Seat[], sectionPrice: number): number {
  return seats.reduce(
    (acc, seat) => acc + (seat.priceOverride ?? sectionPrice),
    0,
  );
}

export function SelectedSeatsList({
  sections,
  holds,
  selectedSeatsBySection,
  onClearSection,
  onClearRow,
  onSelectSeats,
  onClearAll,
}: SelectedSeatsListProps) {
  const entries = Array.from(selectedSeatsBySection.entries());
  const totalSeats = entries.reduce((acc, [, seats]) => acc + seats.length, 0);

  // Calculate total price across all sections
  const totalPrice = entries.reduce((acc, [section, seats]) => {
    return acc + calculateSectionTotal(seats, section.price);
  }, 0);

  if (totalSeats === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="flex size-[56px] items-center justify-center rounded-full bg-light-gray">
            <MousePointerClick className="size-7 text-gray" />
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <p className="text-sm font-medium text-black">No seats selected</p>
            <p className="text-sm text-gray">
              Click or drag on the seatmap to select
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Header with total seats and price */}
      <div className="mb-2 px-2 flex items-center justify-between">
        <span className="text-sm font-bold text-black">
          {totalSeats} seat{totalSeats !== 1 ? "s" : ""} selected
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-gray hover:text-dark-gray transition-colors duration-200 ease cursor-pointer"
        >
          Deselect all
        </button>
      </div>

      <div className="flex flex-col gap-2 px-1">
        {entries.map(([section, seats]) => {
          const seatsByRow = groupSeatsByRow(seats);
          const sortedRows = Array.from(seatsByRow.entries()).sort(([a], [b]) =>
            a.localeCompare(b),
          );

          return (
            <div
              key={section.id}
              className="rounded-[14px] border border-border bg-white p-3"
            >
              {/* Section header with name, price, and count */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-black">
                    {section.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onClearSection(section.id)}
                  className="flex size-5 items-center justify-center rounded-full hover:bg-light-gray transition-colors duration-200 ease cursor-pointer"
                  aria-label={`Clear ${section.name} selection`}
                >
                  <X className="size-3.5 text-gray" />
                </button>
              </div>
              <div className="flex flex-col gap-0.5">
                {sortedRows.map(([rowLabel, rowSeats]) => (
                  <div
                    key={rowLabel}
                    className="group flex items-center justify-between gap-2 text-xs rounded-md px-1.5 py-1 -mx-1.5 hover:bg-light-gray/50 transition-colors duration-200 ease"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-dark-gray w-12">
                        Row {rowLabel}:
                      </span>
                      <span className="text-gray">
                        Seat{rowSeats.length > 1 ? "s" : ""}{" "}
                        {formatSeatNumbers(rowSeats)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onClearRow(section.id, rowLabel)}
                      className="flex size-4 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray/20 transition-opacity duration-200 ease cursor-pointer"
                      aria-label={`Remove Row ${rowLabel}`}
                    >
                      <X className="size-3 text-gray" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
