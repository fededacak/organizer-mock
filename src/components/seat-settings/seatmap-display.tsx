"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Section, Seat, ViewMode, Hold } from "./types";
import type { SeatSettingsControlsSettings } from "./use-seat-settings-controls";
import { SeatmapLegend, getPriceColor } from "./seatmap-legend";
import { ViewModeToggle } from "./view-mode-toggle";
import { ZoomControls } from "./zoom-controls";

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

// Viewport type for zoom/pan state
type Viewport = {
  x: number;
  y: number;
  scale: number;
};

const MIN_SCALE = 0.25;
const MAX_SCALE = 4;


// Get status color for individual seats (status view)
// If seat is held and has a holdColor, that takes priority
function getSeatStatusColor(
  status: Seat["status"],
  holdColor?: string,
): string {
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
  const statusBgColor =
    !isPriceView && seat.status === "held" && holdColor ? holdColor : undefined;
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
    />
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

  // Viewport state for zoom/pan
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const seatRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Handle wheel zoom (centered on cursor position)
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const oldScale = viewport.scale;
      const direction = e.deltaY > 0 ? -1 : 1;
      const scaleBy = 1.1;
      let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

      // Zoom toward/from mouse position
      const mousePointTo = {
        x: (mouseX - viewport.x) / oldScale,
        y: (mouseY - viewport.y) / oldScale,
      };

      setViewport({
        x: mouseX - mousePointTo.x * newScale,
        y: mouseY - mousePointTo.y * newScale,
        scale: newScale,
      });
    },
    [viewport],
  );

  // Attach wheel event listener (needs passive: false for preventDefault)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Handle space key for panning mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Handle panning with mouse movement
  useEffect(() => {
    if (!isPanning) return;

    const handleMouseMove = (e: MouseEvent) => {
      setViewport((prev) => ({
        ...prev,
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanning]);

  // Zoom control handlers
  const handleZoomIn = useCallback(() => {
    setViewport((prev) => {
      const container = containerRef.current;
      if (!container) return prev;

      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const oldScale = prev.scale;
      const newScale = Math.min(MAX_SCALE, oldScale * 1.2);

      const centerPointTo = {
        x: (centerX - prev.x) / oldScale,
        y: (centerY - prev.y) / oldScale,
      };

      return {
        x: centerX - centerPointTo.x * newScale,
        y: centerY - centerPointTo.y * newScale,
        scale: newScale,
      };
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewport((prev) => {
      const container = containerRef.current;
      if (!container) return prev;

      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const oldScale = prev.scale;
      const newScale = Math.max(MIN_SCALE, oldScale / 1.2);

      const centerPointTo = {
        x: (centerX - prev.x) / oldScale,
        y: (centerY - prev.y) / oldScale,
      };

      return {
        x: centerX - centerPointTo.x * newScale,
        y: centerY - centerPointTo.y * newScale,
        scale: newScale,
      };
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) {
      setViewport({ x: 0, y: 0, scale: 1 });
      return;
    }

    // Center the content at 100% scale
    const containerRect = container.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const currentScale = viewport.scale;

    // Calculate content size at scale 1
    const contentWidth = contentRect.width / currentScale;
    const contentHeight = contentRect.height / currentScale;

    setViewport({
      x: (containerRect.width - contentWidth) / 2,
      y: (containerRect.height - contentHeight) / 2,
      scale: 1,
    });
  }, [viewport.scale]);

  // Get cursor style based on current mode
  const getCursor = useCallback(() => {
    if (isPanning) return "grabbing";
    if (isSpacePressed) return "grab";
    return "crosshair";
  }, [isPanning, isSpacePressed]);

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

  // Handle mouse down on container for lasso or panning
  const handleContainerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only start lasso if clicking on the container background, not on a seat
      const target = e.target as HTMLElement;
      if (target.hasAttribute("data-seat-id")) return;

      // Middle mouse button or space + left click starts panning
      if (e.button === 1 || (isSpacePressed && e.button === 0)) {
        e.preventDefault();
        setIsPanning(true);
        return;
      }

      // Left click starts lasso selection (only if not in panning mode)
      if (e.button === 0 && !isSpacePressed) {
        setLassoStart({ x: e.clientX, y: e.clientY });
        setLassoEnd({ x: e.clientX, y: e.clientY });
      }
    },
    [isSpacePressed],
  );

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
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Floating View Mode Toggle */}
      <div className="absolute right-1/2 translate-x-1/2 top-2.5 z-30">
        <ViewModeToggle mode={viewMode} onModeChange={onViewModeChange} />
      </div>

      {/* Floating Zoom Controls (bottom right) */}
      <div className="absolute bottom-4 right-4 z-30">
        <ZoomControls
          scale={viewport.scale}
          minScale={MIN_SCALE}
          maxScale={MAX_SCALE}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleResetZoom}
        />
      </div>

      {/* Seatmap Container */}
      <div
        ref={containerRef}
        className="flex flex-1 min-h-dvh"
        style={{ cursor: getCursor() }}
        onMouseDown={handleContainerMouseDown}
      >
        {/* Transform wrapper for zoom/pan */}
        <div
          ref={contentRef}
          className="origin-top-left flex flex-col items-center justify-center w-full"
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
            willChange: "transform",
          }}
        >
          <div className="flex w-full max-w-[800px] flex-col items-center gap-5 py-16">
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
      </div>

      {/* Lasso rectangle */}
      {lassoStart && lassoEnd && (
        <LassoRect start={lassoStart} end={lassoEnd} />
      )}
    </div>
  );
}
