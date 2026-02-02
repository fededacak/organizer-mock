"use client";

import type { Section, ViewMode, Hold } from "./types";
import { TableSeatButton } from "./table-seat-button";

export interface TableBlockProps {
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

// Table dimensions
const TABLE_DIAMETER = 80;
const SEAT_RADIUS = 58; // Distance from table center to seat center

/**
 * Table block component with seats arranged in a circle
 * Displays a round table with seats positioned around its perimeter
 */
export function TableBlock({
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
}: TableBlockProps) {
  const tableColor = section.color || "#6B7280";
  const seats = section.seats;
  const seatsCount = seats.length;

  // Calculate angle step for evenly distributing seats
  const angleStep = (2 * Math.PI) / seatsCount;

  // Calculate container size to fit table + seats
  const containerSize = (SEAT_RADIUS + 12) * 2; // 12px is half the seat size

  return (
    <div
      className={`relative flex flex-col items-center ${className}`}
      style={{
        width: containerSize,
        height: containerSize + 24, // Extra space for label
      }}
    >
      {/* Seats container - positioned relative to center */}
      <div
        className="relative"
        style={{
          width: containerSize,
          height: containerSize,
        }}
      >
        {/* Round table in the center */}
        <div
          className="absolute rounded-full border-2 flex items-center justify-center"
          style={{
            width: TABLE_DIAMETER,
            height: TABLE_DIAMETER,
            left: `calc(50% - ${TABLE_DIAMETER / 2}px)`,
            top: `calc(50% - ${TABLE_DIAMETER / 2}px)`,
            backgroundColor: `${tableColor}15`,
            borderColor: `${tableColor}40`,
          }}
        >
          {/* Table number in center */}
          <span className="text-xs font-medium" style={{ color: tableColor }}>
            {section.name.replace("Table ", "")}
          </span>
        </div>

        {/* Seats arranged around the table */}
        {seats
          .sort((a, b) => parseInt(a.number) - parseInt(b.number))
          .map((seat, index) => {
            // Start from top (-90 degrees) and go clockwise
            const angle = index * angleStep - Math.PI / 2;
            const hold = seat.holdId ? holdMap.get(seat.holdId) : undefined;

            return (
              <TableSeatButton
                key={seat.id}
                seat={seat}
                tableName={section.name}
                tableColor={tableColor}
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
                angle={angle}
                radius={SEAT_RADIUS}
              />
            );
          })}
      </div>

      {/* Table name label below */}
      <span className="text-xs font-medium text-gray-500 mt-1">
        {section.name}
      </span>
    </div>
  );
}
