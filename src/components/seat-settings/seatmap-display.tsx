"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { Section, Seat, ViewMode, Hold } from "./types";
import type { SeatSettingsControlsSettings } from "./use-seat-settings-controls";
import { SeatmapLegend } from "./seatmap-legend";
import { ZoomControls } from "./zoom-controls";
import { MIN_SCALE, MAX_SCALE } from "./seatmap-utils";
import { SectionBlock } from "./section-block";
import { LassoRect } from "./lasso-rect";
import { useViewport } from "./use-viewport";
import { useLassoSelection } from "./use-lasso-selection";

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

/**
 * Main seatmap display component
 * Renders an interactive seatmap with zoom/pan and selection capabilities
 */
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
  const [lastSelectedSeat, setLastSelectedSeat] = useState<string | null>(null);
  const seatRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Viewport zoom/pan hook
  const {
    viewport,
    isSpacePressed,
    containerRef,
    contentRef,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    getCursor,
    handleContainerMouseDown: handleViewportMouseDown,
  } = useViewport();

  // Lasso selection hook
  const { lassoStart, lassoEnd, lassoSeats, handleLassoMouseDown } =
    useLassoSelection({
      seatRefs,
      onSelectSeats,
      isSpacePressed,
    });

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

  // Handle mouse down on container for lasso or panning
  const handleContainerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Try viewport panning first
      if (handleViewportMouseDown(e)) {
        return;
      }
      // Otherwise try lasso selection
      handleLassoMouseDown(e);
    },
    [handleViewportMouseDown, handleLassoMouseDown],
  );

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

  // Shared props for all section blocks
  const sectionBlockProps = {
    selectedSeats,
    lassoSeats,
    viewMode,
    priceRange,
    holdMap,
    onToggleSeat: handleToggleSeat,
    onSeatMouseDown: handleSeatMouseDown,
    onSeatMouseEnter: handleSeatMouseEnter,
    seatRefs,
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Floating Zoom Controls (top right) */}
      <div className="absolute right-2.5 top-2.5 z-30 flex gap-2">
        <ZoomControls
          scale={viewport.scale}
          minScale={MIN_SCALE}
          maxScale={MAX_SCALE}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleResetZoom}
        />
                <SeatmapLegend
          sections={sections}
          holds={holds}
          selectedSeats={selectedSeats}
          viewMode={viewMode}
          priceRange={priceRange}
          onSelectSeats={onSelectSeats}
          onViewModeChange={onViewModeChange}
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
              {balconyLeft && (
                <SectionBlock section={balconyLeft} {...sectionBlockProps} />
              )}
              {floor && (
                <SectionBlock section={floor} {...sectionBlockProps} />
              )}
              {balconyRight && (
                <SectionBlock section={balconyRight} {...sectionBlockProps} />
              )}
            </div>

            {/* Bottom row: VIP Box and Upper Deck */}
            <div className="flex items-start justify-center gap-3">
              {vipBox && (
                <SectionBlock section={vipBox} {...sectionBlockProps} />
              )}
              {upperDeck && (
                <SectionBlock section={upperDeck} {...sectionBlockProps} />
              )}
            </div>
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
