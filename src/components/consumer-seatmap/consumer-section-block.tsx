"use client";

import type { Section, Hold } from "../seat-settings/types";
import { ConsumerSeatButton } from "./consumer-seat-button";
import { groupSeatsByRow } from "../seat-settings/seatmap-utils";

export interface ConsumerSectionBlockProps {
  section: Section;
  selectedSeats: Set<string>;
  unlockedHolds: Set<string>;
  holdMap: Map<string, Hold>;
  onSelectSeat: (seatId: string) => void;
  onLockedClick: (hold: Hold) => void;
  className?: string;
}

/**
 * Consumer section block component
 * Displays a venue section with seats in a consumer-friendly way
 */
export function ConsumerSectionBlock({
  section,
  selectedSeats,
  unlockedHolds,
  holdMap,
  onSelectSeat,
  onLockedClick,
  className = "",
}: ConsumerSectionBlockProps) {
  const sectionColor = section.color || "#6B7280";
  const seatsByRow = groupSeatsByRow(section.seats);

  // Sort rows alphabetically
  const sortedRows = Array.from(seatsByRow.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <div
      className={`relative flex flex-col border-[1.5px] rounded-[8px] p-3 transition-all duration-200 ease-out ${className}`}
      style={{
        backgroundColor: "transparent",
        borderColor: "#F6F7FA",
        borderStyle: "solid",
      }}
    >
      {/* Section name */}
      <div className="mb-2 flex items-center justify-center">
        <span className="text-xs font-medium text-gray-500">
          {section.name}
        </span>
      </div>

      {/* Seats grid - rows */}
      <div className="flex flex-col gap-1">
        {sortedRows.map(([rowLabel, seats]) => (
          <div key={rowLabel} className="flex justify-center gap-1">
            {seats
              .sort((a, b) => parseInt(a.number) - parseInt(b.number))
              .map((seat) => {
                const hold = seat.holdId ? holdMap.get(seat.holdId) : undefined;
                const isUnlocked = hold ? unlockedHolds.has(hold.id) : false;

                return (
                  <ConsumerSeatButton
                    key={seat.id}
                    seat={seat}
                    sectionName={section.name}
                    sectionColor={sectionColor}
                    hold={hold}
                    isSelected={selectedSeats.has(seat.id)}
                    isUnlocked={isUnlocked}
                    onSelect={() => onSelectSeat(seat.id)}
                    onLockedClick={() => {
                      if (hold) onLockedClick(hold);
                    }}
                  />
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
