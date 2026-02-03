"use client";

import { useMemo } from "react";
import type { Section, Hold } from "../seat-settings/types";
import { ZoomControls } from "../seat-settings/zoom-controls";
import { useViewport } from "../seat-settings/use-viewport";
import { MIN_SCALE, MAX_SCALE } from "../seat-settings/seatmap-utils";
import { ConsumerSectionBlock } from "./consumer-section-block";
import { ConsumerSeatmapLegend } from "./consumer-seatmap-legend";

interface ConsumerSeatmapDisplayProps {
  sections: Section[];
  holds: Hold[];
  selectedSeats: Set<string>;
  unlockedHolds: Set<string>;
  onSelectSeat: (seatId: string) => void;
  onLockedClick: (hold: Hold) => void;
}

/**
 * Consumer seatmap display component
 * Renders an interactive seatmap for consumers to select seats
 */
export function ConsumerSeatmapDisplay({
  sections,
  holds,
  selectedSeats,
  unlockedHolds,
  onSelectSeat,
  onLockedClick,
}: ConsumerSeatmapDisplayProps) {
  // Viewport zoom/pan hook
  const {
    viewport,
    containerRef,
    contentRef,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    getCursor,
    handleContainerMouseDown,
  } = useViewport();

  // Create hold map for quick lookup by holdId
  const holdMap = useMemo(() => {
    const map = new Map<string, Hold>();
    for (const hold of holds) {
      map.set(hold.id, hold);
    }
    return map;
  }, [holds]);

  // Find sections by name for positioning
  const floor = sections.find((s) => s.name === "Floor");
  const balconyLeft = sections.find((s) => s.name === "Balcony Left");
  const balconyRight = sections.find((s) => s.name === "Balcony Right");
  const vipBox = sections.find((s) => s.name === "VIP Box");
  const upperDeck = sections.find((s) => s.name === "Upper Deck");

  // Shared props for all section blocks
  const sectionBlockProps = {
    selectedSeats,
    unlockedHolds,
    holdMap,
    onSelectSeat,
    onLockedClick,
  };

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-light-gray">
      {/* Floating Controls (top right) */}
      <div className="absolute left-2.5 top-2.5 z-30 flex gap-2">
        <ConsumerSeatmapLegend />
      </div>
      <div className="absolute left-2.5 bottom-2.5 z-30 flex gap-2">
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
        className="flex flex-1"
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
                <ConsumerSectionBlock
                  section={balconyLeft}
                  {...sectionBlockProps}
                />
              )}
              {floor && (
                <ConsumerSectionBlock section={floor} {...sectionBlockProps} />
              )}
              {balconyRight && (
                <ConsumerSectionBlock
                  section={balconyRight}
                  {...sectionBlockProps}
                />
              )}
            </div>

            {/* Bottom row: VIP Box and Upper Deck */}
            <div className="flex items-start justify-center gap-3">
              {vipBox && (
                <ConsumerSectionBlock section={vipBox} {...sectionBlockProps} />
              )}
              {upperDeck && (
                <ConsumerSectionBlock
                  section={upperDeck}
                  {...sectionBlockProps}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
