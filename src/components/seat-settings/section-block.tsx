"use client";

import type { Section, ViewMode, Hold } from "./types";
import { SeatButton } from "./seat-button";
import { groupSeatsByRow } from "./seatmap-utils";

export interface SectionBlockProps {
  section: Section;
  selectedSeats: Set<string>;
  lassoSeats: Set<string>;
  viewMode: ViewMode;
  priceColorMap: Map<number, string>;
  holdMap: Map<string, Hold>;
  onToggleSeat: (seatId: string) => void;
  onSeatMouseDown: (seatId: string, e: React.MouseEvent) => void;
  onSeatMouseEnter: (seatId: string) => void;
  seatRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>;
  className?: string;
}

/**
 * Section block component with seats arranged in rows
 * Displays a venue section with all its seats grouped by row
 */
export function SectionBlock({
  section,
  selectedSeats,
  lassoSeats,
  viewMode,
  priceColorMap,
  holdMap,
  onToggleSeat,
  onSeatMouseDown,
  onSeatMouseEnter,
  seatRefs,
  className = "",
}: SectionBlockProps) {
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
                return (
                  <SeatButton
                    key={seat.id}
                    seat={seat}
                    sectionColor={sectionColor}
                    viewMode={viewMode}
                    priceColorMap={priceColorMap}
                    holdColor={hold?.color}
                    holdName={hold?.name}
                    isSelected={selectedSeats.has(seat.id)}
                    isInLasso={lassoSeats.has(seat.id)}
                    onToggle={() => onToggleSeat(seat.id)}
                    onMouseDown={(e) => onSeatMouseDown(seat.id, e)}
                    onMouseEnter={() => onSeatMouseEnter(seat.id)}
                    seatRef={(el) => {
                      if (el) {
                        seatRefs.current.set(seat.id, el);
                      } else {
                        seatRefs.current.delete(seat.id);
                      }
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
