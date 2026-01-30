"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Section, Seat, ViewMode, Hold } from "./types";
import type { SeatSettingsControlsSettings } from "./use-seat-settings-controls";
import { SeatmapLegend, getPriceColor } from "./seatmap-legend";

interface SeatmapDisplayProps {
  sections: Section[];
  holds: Hold[];
  selectedSeats: Set<string>;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleSeat: (seatId: string) => void;
  onSelectSeats: (seatIds: string[], additive?: boolean) => void;
  settings?: SeatSettingsControlsSettings;
}


// View mode toggle component
function ViewModeToggle({
  mode,
  onModeChange,
}: {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex h-[36px] items-center rounded-full bg-light-gray p-1">
      <button
        type="button"
        onClick={() => onModeChange("status")}
        className={cn(
          "h-full px-4 rounded-full text-xs font-semibold transition-all duration-200 ease cursor-pointer",
          mode === "status"
            ? "bg-white text-black shadow-sm"
            : "text-gray hover:text-dark-gray",
        )}
      >
        Status
      </button>
      <button
        type="button"
        onClick={() => onModeChange("price")}
        className={cn(
          "h-full px-4 rounded-full text-xs font-semibold transition-all duration-200 ease cursor-pointer",
          mode === "price"
            ? "bg-white text-black shadow-sm"
            : "text-gray hover:text-dark-gray",
        )}
      >
        Price
      </button>
    </div>
  );
}

// Get status color for individual seats (status view)
// If seat is held and has a holdColor, that takes priority
function getSeatStatusColor(status: Seat["status"], holdColor?: string): string {
  if (status === "held" && holdColor) {
    return ""; // Use inline style for hold color
  }
  switch (status) {
    case "on-sale":
      return "bg-white";
    case "sold":
      return "bg-gray-400";
    case "held":
      return "bg-red-400"; // Fallback for holds without color
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

// Individual seat component for seat mode
function SeatButton({
  seat,
  sectionColor,
  sectionPrice,
  viewMode,
  priceRange,
  holdColor,
  holdName,
  isSelected,
  isInLasso,
  onToggle,
  onMouseDown,
  onMouseEnter,
  seatRef,
}: {
  seat: Seat;
  sectionColor: string;
  sectionPrice: number;
  viewMode: ViewMode;
  priceRange: { min: number; max: number };
  holdColor?: string;
  holdName?: string;
  isSelected: boolean;
  isInLasso: boolean;
  onToggle: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  seatRef: (el: HTMLButtonElement | null) => void;
}) {
  const effectivePrice = seat.priceOverride ?? sectionPrice;
  const hasOverride = seat.priceOverride !== undefined;
  const priceLabel = `$${effectivePrice}`;

  // Determine background color based on view mode
  const isPriceView = viewMode === "price";
  const priceColor = isPriceView
    ? getPriceColor(effectivePrice, priceRange.min, priceRange.max)
    : undefined;

  // For status view, use hold color if available
  const statusBgColor = !isPriceView && seat.status === "held" && holdColor ? holdColor : undefined;
  const statusClass = getSeatStatusColor(seat.status, holdColor);

  // Build tooltip
  let tooltip = `Row ${seat.row}, Seat ${seat.number} (${seat.status})`;
  if (holdName && seat.status === "held") {
    tooltip = `Row ${seat.row}, Seat ${seat.number} - ${holdName}`;
  }
  tooltip += ` - ${priceLabel}${hasOverride ? " (override)" : ""}`;

  return (
    <button
      ref={seatRef}
      type="button"
      onClick={onToggle}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      className={cn(
        "size-6 rounded-[2px] transition-all duration-150 ease-out cursor-pointer relative",
        !isPriceView && statusClass,
        isSelected && "ring-2 ring-tp-blue ring-offset-1",
        isInLasso && !isSelected && "ring-2 ring-tp-blue/50 ring-offset-1",
        !isSelected && !isInLasso && "hover:ring-2 hover:ring-offset-1",
      )}
      style={{
        backgroundColor: isPriceView ? priceColor : statusBgColor,
        boxShadow:
          !isSelected && !isInLasso
            ? `0 0 0 0.5px ${sectionColor}50`
            : undefined,
      }}
      title={tooltip}
      data-seat-id={seat.id}
    >
      {/* Price override indicator */}
      {hasOverride && (
        <div className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-tp-orange border border-white" />
      )}
    </button>
  );
}

// Section block component with seats in rows
function SectionBlock({
  section,
  selectedSeats,
  lassoSeats,
  viewMode,
  priceRange,
  holdMap,
  onToggleSeat,
  onSeatMouseDown,
  onSeatMouseEnter,
  seatRefs,
  className = "",
}: {
  section: Section;
  selectedSeats: Set<string>;
  lassoSeats: Set<string>;
  viewMode: ViewMode;
  priceRange: { min: number; max: number };
  holdMap: Map<string, Hold>;
  onToggleSeat: (seatId: string) => void;
  onSeatMouseDown: (seatId: string, e: React.MouseEvent) => void;
  onSeatMouseEnter: (seatId: string) => void;
  seatRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>;
  className?: string;
}) {
  const sectionColor = section.color || "#6B7280";
  const seatsByRow = groupSeatsByRow(section.seats);

  // Sort rows alphabetically
  const sortedRows = Array.from(seatsByRow.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div
      className={`relative flex flex-col border-[1.5px] rounded-[8px] p-3 transition-all duration-200 ease-out ${className}`}
      style={{
        backgroundColor: "transparent",
        borderColor: "white",
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
                    sectionPrice={section.price}
                    viewMode={viewMode}
                    priceRange={priceRange}
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

// Lasso selection rectangle
function LassoRect({
  start,
  end,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
}) {
  const left = Math.min(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  return (
    <div
      className="fixed pointer-events-none border-2 border-tp-blue bg-tp-blue/10 rounded-[2px] z-50"
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  );
}

// Main seatmap display component
export function SeatmapDisplay({
  sections,
  holds,
  selectedSeats,
  viewMode,
  onViewModeChange,
  onToggleSeat,
  onSelectSeats,
  settings,
}: SeatmapDisplayProps) {
  const [lassoStart, setLassoStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [lassoEnd, setLassoEnd] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [lassoSeats, setLassoSeats] = useState<Set<string>>(new Set());
  const [lastSelectedSeat, setLastSelectedSeat] = useState<string | null>(null);

  const seatRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Create hold map for quick lookup by holdId
  const holdMap = useMemo(() => {
    const map = new Map<string, Hold>();
    for (const hold of holds) {
      map.set(hold.id, hold);
    }
    return map;
  }, [holds]);

  // Calculate price range for color scaling
  const priceRange = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const section of sections) {
      min = Math.min(min, section.price);
      max = Math.max(max, section.price);
      for (const seat of section.seats) {
        if (seat.priceOverride !== undefined) {
          min = Math.min(min, seat.priceOverride);
          max = Math.max(max, seat.priceOverride);
        }
      }
    }
    return {
      min: min === Infinity ? 0 : min,
      max: max === -Infinity ? 0 : max,
    };
  }, [sections]);

  // Find sections by name for positioning
  const floor = sections.find((s) => s.name === "Floor");
  const balconyLeft = sections.find((s) => s.name === "Balcony Left");
  const balconyRight = sections.find((s) => s.name === "Balcony Right");
  const vipBox = sections.find((s) => s.name === "VIP Box");
  const upperDeck = sections.find((s) => s.name === "Upper Deck");

  // Get all seats as a flat array for range selection
  const getAllSeats = useCallback(() => {
    const allSeats: {
      id: string;
      section: Section;
      row: string;
      number: number;
    }[] = [];
    for (const section of sections) {
      for (const seat of section.seats) {
        allSeats.push({
          id: seat.id,
          section,
          row: seat.row,
          number: parseInt(seat.number),
        });
      }
    }
    return allSeats;
  }, [sections]);

  // Check if a seat element is within the lasso rectangle
  const isSeatInLasso = useCallback(
    (
      seatEl: HTMLButtonElement,
      start: { x: number; y: number },
      end: { x: number; y: number },
    ) => {
      const rect = seatEl.getBoundingClientRect();
      const lassoLeft = Math.min(start.x, end.x);
      const lassoRight = Math.max(start.x, end.x);
      const lassoTop = Math.min(start.y, end.y);
      const lassoBottom = Math.max(start.y, end.y);

      // Check if seat center is within lasso
      const seatCenterX = rect.left + rect.width / 2;
      const seatCenterY = rect.top + rect.height / 2;

      return (
        seatCenterX >= lassoLeft &&
        seatCenterX <= lassoRight &&
        seatCenterY >= lassoTop &&
        seatCenterY <= lassoBottom
      );
    },
    [],
  );

  // Update lasso seats during drag
  useEffect(() => {
    if (!lassoStart || !lassoEnd) {
      setLassoSeats(new Set());
      return;
    }

    const seatsInLasso = new Set<string>();
    seatRefs.current.forEach((el, seatId) => {
      if (isSeatInLasso(el, lassoStart, lassoEnd)) {
        seatsInLasso.add(seatId);
      }
    });
    setLassoSeats(seatsInLasso);
  }, [lassoStart, lassoEnd, isSeatInLasso]);

  // Handle mouse down on container for lasso
  const handleContainerMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start lasso if clicking on the container background, not on a seat
    const target = e.target as HTMLElement;
    if (target.hasAttribute("data-seat-id")) return;

    setLassoStart({ x: e.clientX, y: e.clientY });
    setLassoEnd({ x: e.clientX, y: e.clientY });
  }, []);

  // Handle mouse move for lasso
  useEffect(() => {
    if (!lassoStart) return;

    const handleMouseMove = (e: MouseEvent) => {
      setLassoEnd({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      if (lassoSeats.size > 0) {
        // Always additive - stack lasso selections
        onSelectSeats(Array.from(lassoSeats), true);
      }
      setLassoStart(null);
      setLassoEnd(null);
      setLassoSeats(new Set());
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [lassoStart, lassoSeats, onSelectSeats]);

  // Handle seat mouse down (for shift-click range selection)
  const handleSeatMouseDown = useCallback(
    (seatId: string, e: React.MouseEvent) => {
      if (e.shiftKey && lastSelectedSeat) {
        e.preventDefault();

        // Get all seats and find range
        const allSeats = getAllSeats();
        const lastIndex = allSeats.findIndex((s) => s.id === lastSelectedSeat);
        const currentIndex = allSeats.findIndex((s) => s.id === seatId);

        if (lastIndex !== -1 && currentIndex !== -1) {
          const start = Math.min(lastIndex, currentIndex);
          const end = Math.max(lastIndex, currentIndex);
          const rangeSeats = allSeats.slice(start, end + 1).map((s) => s.id);
          onSelectSeats(rangeSeats, false);
        }
      } else {
        setLastSelectedSeat(seatId);
      }
    },
    [lastSelectedSeat, getAllSeats, onSelectSeats],
  );

  // Handle seat mouse enter (for potential drag selection)
  const handleSeatMouseEnter = useCallback((_seatId: string) => {
    // Could be used for drag-to-select within a row
  }, []);

  // Handle seat toggle
  const handleToggleSeat = useCallback(
    (seatId: string) => {
      onToggleSeat(seatId);
      setLastSelectedSeat(seatId);
    },
    [onToggleSeat],
  );

  return (
    <div className="flex flex-1 flex-col gap-2 py-2.5 pr-2.5">
      {/* View Mode Toggle Header */}

      {/* Seatmap Container */}
      <div
        ref={containerRef}
        className="flex flex-1 flex-col items-center rounded-[20px] bg-white px-6 cursor-crosshair"
        onMouseDown={handleContainerMouseDown}
      >
        <div className="flex items-center justify-end p-4">
          <ViewModeToggle mode={viewMode} onModeChange={onViewModeChange} />
        </div>
        <div className="flex w-full max-w-[800px] flex-col items-center gap-5 h-full justify-center">
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
                selectedSeats={selectedSeats}
                lassoSeats={lassoSeats}
                viewMode={viewMode}
                priceRange={priceRange}
                holdMap={holdMap}
                onToggleSeat={handleToggleSeat}
                onSeatMouseDown={handleSeatMouseDown}
                onSeatMouseEnter={handleSeatMouseEnter}
                seatRefs={seatRefs}
              />
            )}

            {/* Floor (center, larger) */}
            {floor && (
              <SectionBlock
                section={floor}
                selectedSeats={selectedSeats}
                lassoSeats={lassoSeats}
                viewMode={viewMode}
                priceRange={priceRange}
                holdMap={holdMap}
                onToggleSeat={handleToggleSeat}
                onSeatMouseDown={handleSeatMouseDown}
                onSeatMouseEnter={handleSeatMouseEnter}
                seatRefs={seatRefs}
              />
            )}

            {/* Balcony Right */}
            {balconyRight && (
              <SectionBlock
                section={balconyRight}
                selectedSeats={selectedSeats}
                lassoSeats={lassoSeats}
                viewMode={viewMode}
                priceRange={priceRange}
                holdMap={holdMap}
                onToggleSeat={handleToggleSeat}
                onSeatMouseDown={handleSeatMouseDown}
                onSeatMouseEnter={handleSeatMouseEnter}
                seatRefs={seatRefs}
              />
            )}
          </div>

          {/* Bottom row: VIP Box and Upper Deck */}
          <div className="flex items-start justify-center gap-3">
            {/* VIP Box */}
            {vipBox && (
              <SectionBlock
                section={vipBox}
                selectedSeats={selectedSeats}
                lassoSeats={lassoSeats}
                viewMode={viewMode}
                priceRange={priceRange}
                holdMap={holdMap}
                onToggleSeat={handleToggleSeat}
                onSeatMouseDown={handleSeatMouseDown}
                onSeatMouseEnter={handleSeatMouseEnter}
                seatRefs={seatRefs}
              />
            )}

            {/* Upper Deck */}
            {upperDeck && (
              <SectionBlock
                section={upperDeck}
                selectedSeats={selectedSeats}
                lassoSeats={lassoSeats}
                viewMode={viewMode}
                priceRange={priceRange}
                holdMap={holdMap}
                onToggleSeat={handleToggleSeat}
                onSeatMouseDown={handleSeatMouseDown}
                onSeatMouseEnter={handleSeatMouseEnter}
                seatRefs={seatRefs}
              />
            )}
          </div>

          {/* Legend */}
          <SeatmapLegend
            sections={sections}
            holds={holds}
            selectedSeats={selectedSeats}
            viewMode={viewMode}
            priceRange={priceRange}
            onSelectSeats={onSelectSeats}
          />
        </div>
      </div>

      {/* Lasso rectangle */}
      {lassoStart && lassoEnd && (
        <LassoRect start={lassoStart} end={lassoEnd} />
      )}
    </div>
  );
}
