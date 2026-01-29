"use client";

import type { Section, Seat } from "./types";
import { sectionGridConfig } from "./mock-data";

interface SeatmapDisplayProps {
  sections: Section[];
  selectedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
}

// Get status color for individual seats
function getSeatColor(status: Seat["status"]): string {
  switch (status) {
    case "available":
      return "bg-white";
    case "sold":
      return "bg-gray-400";
    case "reserved":
      return "bg-amber-400";
    case "held":
      return "bg-red-400";
    default:
      return "bg-white";
  }
}

// Group seats by row
function groupSeatsByRow(seats: Seat[]): Map<string, Seat[]> {
  const rows = new Map<string, Seat[]>();
  for (const seat of seats) {
    const existing = rows.get(seat.row) || [];
    existing.push(seat);
    rows.set(seat.row, existing);
  }
  return rows;
}

// Section block component with seats in rows
function SectionBlock({
  section,
  isSelected,
  onToggle,
  className = "",
}: {
  section: Section;
  isSelected: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const sectionColor = section.color || "#6B7280";
  const gridConfig = sectionGridConfig[section.id];
  const seatsByRow = groupSeatsByRow(section.seats);

  // Sort rows alphabetically
  const sortedRows = Array.from(seatsByRow.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <button
      onClick={onToggle}
      className={`relative flex flex-col border-[1.5px] rounded-[8px] p-3 transition-all duration-200 ease-out cursor-pointer ${className}`}
      style={{
        backgroundColor: `${sectionColor}15`,
        borderColor: isSelected ? sectionColor : "white",
        borderStyle: "solid",
      }}
    >
      {/* Section name label */}
      <span
        className="mb-2 text-xs font-medium"
        style={{ color: sectionColor }}
      >
        {section.name}
      </span>

      {/* Seats grid - rows */}
      <div className="flex flex-col gap-1">
        {sortedRows.map(([rowLabel, seats]) => (
          <div key={rowLabel} className="flex justify-center gap-1">
            {seats
              .sort((a, b) => parseInt(a.number) - parseInt(b.number))
              .map((seat) => (
                <div
                  key={seat.id}
                  className={`size-6 rounded-[2px] ${getSeatColor(seat.status)}`}
                  style={{
                    boxShadow: `0 0 0 0.5px ${sectionColor}50`,
                  }}
                  title={`Row ${seat.row}, Seat ${seat.number} (${seat.status})`}
                />
              ))}
          </div>
        ))}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div
          className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full"
          style={{ backgroundColor: sectionColor }}
        >
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  );
}

// Main seatmap display component
export function SeatmapDisplay({
  sections,
  selectedSections,
  onToggleSection,
}: SeatmapDisplayProps) {
  // Find sections by name for positioning
  const floor = sections.find((s) => s.name === "Floor");
  const balconyLeft = sections.find((s) => s.name === "Balcony Left");
  const balconyRight = sections.find((s) => s.name === "Balcony Right");
  const vipBox = sections.find((s) => s.name === "VIP Box");
  const upperDeck = sections.find((s) => s.name === "Upper Deck");

  return (
    <div className="flex flex-1 flex-col gap-6 py-2.5 pr-2.5">
      {/* Seatmap Container */}
      <div className="flex flex-1 items-center justify-center rounded-[20px] bg-white p-6">
        <div className="flex w-full max-w-[800px] flex-col items-center gap-5">
          {/* Stage */}
          <div className="flex h-16 w-full max-w-[450px] items-center justify-center rounded-[8px] bg-gray-800">
            <span className="text-xs font-bold tracking-widest text-white">
              STAGE
            </span>
          </div>

          {/* Main seating area: Balcony Left - Floor - Balcony Right */}
          <div className="flex w-full items-start justify-center gap-3">
            {/* Balcony Left */}
            {balconyLeft && (
              <SectionBlock
                section={balconyLeft}
                isSelected={selectedSections.has(balconyLeft.id)}
                onToggle={() => onToggleSection(balconyLeft.id)}
              />
            )}

            {/* Floor (center, larger) */}
            {floor && (
              <SectionBlock
                section={floor}
                isSelected={selectedSections.has(floor.id)}
                onToggle={() => onToggleSection(floor.id)}
              />
            )}

            {/* Balcony Right */}
            {balconyRight && (
              <SectionBlock
                section={balconyRight}
                isSelected={selectedSections.has(balconyRight.id)}
                onToggle={() => onToggleSection(balconyRight.id)}
              />
            )}
          </div>

          {/* Bottom row: VIP Box and Upper Deck */}
          <div className="flex items-start justify-center gap-3">
            {/* VIP Box */}
            {vipBox && (
              <SectionBlock
                section={vipBox}
                isSelected={selectedSections.has(vipBox.id)}
                onToggle={() => onToggleSection(vipBox.id)}
              />
            )}

            {/* Upper Deck */}
            {upperDeck && (
              <SectionBlock
                section={upperDeck}
                isSelected={selectedSections.has(upperDeck.id)}
                onToggle={() => onToggleSection(upperDeck.id)}
              />
            )}
          </div>

          {/* Legend */}
          <div className="mt-2 flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-[2px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.2)]" />
              <span className="text-[10px] text-gray-500">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-[2px] bg-gray-400" />
              <span className="text-[10px] text-gray-500">Sold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-[2px] bg-amber-400" />
              <span className="text-[10px] text-gray-500">Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-[2px] bg-red-400" />
              <span className="text-[10px] text-gray-500">Held</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
