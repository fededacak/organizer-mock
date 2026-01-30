"use client";

import {
  X,
  MousePointerClick,
  Hand,
  DollarSign,
  Grid3X3,
  Lock,
} from "lucide-react";
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

// Compute venue stats for quick actions
function computeVenueStats(sections: Section[], holds: Hold[]) {
  let heldSeatsWithoutHold: string[] = [];
  let overrideSeats: string[] = [];
  let availableBySection: { section: Section; seatIds: string[] }[] = [];
  let holdGroups: { hold: Hold; seatIds: string[] }[] = [];

  // Create holdId to Hold map
  const holdMap = new Map<string, Hold>();
  for (const hold of holds) {
    holdMap.set(hold.id, hold);
    holdGroups.push({ hold, seatIds: [...hold.seatIds] });
  }

  for (const section of sections) {
    const sectionAvailable: string[] = [];

    for (const seat of section.seats) {
      if (seat.status === "held" && !seat.holdId) {
        // Held seat without a hold (legacy)
        heldSeatsWithoutHold.push(seat.id);
      }
      if (seat.priceOverride !== undefined) {
        overrideSeats.push(seat.id);
      }
      if (seat.status === "on-sale") {
        sectionAvailable.push(seat.id);
      }
    }

    if (sectionAvailable.length > 0 && section.status === "on-sale") {
      availableBySection.push({ section, seatIds: sectionAvailable });
    }
  }

  return {
    heldSeatsWithoutHold,
    overrideSeats,
    availableBySection,
    holdGroups,
  };
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

  // Compute venue stats for quick actions
  const {
    heldSeatsWithoutHold,
    overrideSeats,
    availableBySection,
    holdGroups,
  } = computeVenueStats(sections, holds);

  // Filter hold groups that have seats
  const activeHoldGroups = holdGroups.filter((g) => g.seatIds.length > 0);

  if (totalSeats === 0) {
    const hasQuickActions =
      heldSeatsWithoutHold.length > 0 ||
      overrideSeats.length > 0 ||
      availableBySection.length > 0 ||
      activeHoldGroups.length > 0;

    return (
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="mb-3 flex flex-col justify-center items-center gap-2 h-full">
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

        {/* Quick Select Actions */}
        {hasQuickActions && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-dark-gray uppercase tracking-wide">
              Quick Select
            </p>

            <div className="flex flex-col gap-1.5">
              {/* Select by hold - show each hold group */}
              {activeHoldGroups.map(({ hold, seatIds }) => (
                <button
                  key={hold.id}
                  type="button"
                  onClick={() => onSelectSeats(seatIds)}
                  className="flex items-center gap-2.5 rounded-xl bg-light-gray px-3 py-2.5 text-left transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer group"
                >
                  <div
                    className="flex size-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${hold.color}20` }}
                  >
                    {hold.type === "password-protected" ? (
                      <Lock className="size-4" style={{ color: hold.color }} />
                    ) : (
                      <Hand className="size-4" style={{ color: hold.color }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">
                      {hold.name}
                    </p>
                    <p className="text-xs text-gray">
                      {seatIds.length} seat{seatIds.length !== 1 ? "s" : ""} on
                      hold
                    </p>
                  </div>
                </button>
              ))}

              {/* Select held seats without a hold (legacy) */}
              {heldSeatsWithoutHold.length > 0 && (
                <button
                  type="button"
                  onClick={() => onSelectSeats(heldSeatsWithoutHold)}
                  className="flex items-center gap-2.5 rounded-xl bg-light-gray px-3 py-2.5 text-left transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer group"
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-red-100">
                    <Hand className="size-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black">
                      Other held seats
                    </p>
                    <p className="text-xs text-gray">
                      {heldSeatsWithoutHold.length} seat
                      {heldSeatsWithoutHold.length !== 1 ? "s" : ""} on hold
                    </p>
                  </div>
                </button>
              )}

              {/* Select seats with price overrides */}
              {overrideSeats.length > 0 && (
                <button
                  type="button"
                  onClick={() => onSelectSeats(overrideSeats)}
                  className="flex items-center gap-2.5 rounded-xl bg-light-gray px-3 py-2.5 text-left transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer group"
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-orange-100">
                    <DollarSign className="size-4 text-tp-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black">
                      Custom pricing
                    </p>
                    <p className="text-xs text-gray">
                      {overrideSeats.length} seat
                      {overrideSeats.length !== 1 ? "s" : ""} with overrides
                    </p>
                  </div>
                </button>
              )}

              {/* Select all in section - show up to 3 sections */}
              {availableBySection.slice(0, 3).map(({ section, seatIds }) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => onSelectSeats(seatIds)}
                  className="flex items-center gap-2.5 rounded-xl bg-light-gray px-3 py-2.5 text-left transition-colors duration-200 ease hover:bg-soft-gray cursor-pointer group"
                >
                  <div
                    className="flex size-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${section.color}20` }}
                  >
                    <Grid3X3
                      className="size-4"
                      style={{ color: section.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">
                      {section.name}
                    </p>
                    <p className="text-xs text-gray">
                      {seatIds.length} available seat
                      {seatIds.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fallback if no quick actions available */}
        {!hasQuickActions && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-xs text-gray">
              No quick actions available. Use the seatmap to select seats.
            </p>
          </div>
        )}
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
